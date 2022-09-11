import api from '@/api'
import Cookies from 'js-cookie'
import { Buffer } from 'buffer'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { errorHandle, message } from '@/utils/helper'
import { User, Todo, Profile } from '@/store/types/accounts'

export const useAccount = defineStore('account', () => {
  // states
  const accessToken = ref<string>('')
  const userInfo = ref<User | null>(null)
  const todoList = ref<Todo[]>([])

  // getters
  const superAuth = computed(() => userInfo.value?.is_superuser)
  const staffAuth = computed(() =>
    userInfo.value?.staffauth ? userInfo.value.staffauth : null,
  )
  const isAuthorized = computed(
    () => accessToken.value.length && !!userInfo.value,
  )
  const myTodos = computed(() =>
    todoList.value.filter(
      todo => !todo.soft_deleted && todo.user === userInfo.value?.pk,
    ),
  )

  // actions
  const extractId = (token: string) => {
    const base64Payload = token.split('.')[1]
    const payload = Buffer.from(base64Payload, 'base64')
    const result = JSON.parse(payload.toString())
    return result.user_id ? result.user_id : null
  }

  const signup = (payload: {
    email: string
    username: string
    password: string
  }) => {
    api
      .post('/user/', payload)
      .then(() => {
        message('info', '', '회원가입이 완료되었습니다.')
      })
      .catch(err => errorHandle(err.response.data))
  }

  const setToken = (token: string) => {
    accessToken.value = token
    api.defaults.headers.common.Authorization = `Bearer ${accessToken.value}`
    Cookies.set('accessToken', accessToken.value, { expires: 14 })
  }

  const setUser = (user: User) => {
    userInfo.value = user
    fetchTodoList()
  }

  const login = (payload: { email: string; password: string }) =>
    api
      .post('/token/', payload)
      .then(res => {
        setToken(res.data.access)
        return api.get(`/user/${extractId(accessToken.value)}`)
      })
      .then(res => {
        setUser(res.data)
        message('', '', '로그인 성공 알림!')
      })
      .catch(err => {
        console.log(err.response)
        if (err.response.status === 401)
          message('warning', '', err.response.data.detail)
      })

  const loginByToken = (token?: string) => {
    if (token) {
      setToken(token)
      return api
        .get(`/user/${extractId(token)}`)
        .then(res => setUser(res.data))
        .catch(err => {
          console.log(err.response.data)
        })
    } else return Promise.resolve()
  }

  const logout = () => {
    userInfo.value = null
    todoList.value = []
    accessToken.value = ''
    delete api.defaults.headers.common.Authorization
    Cookies.remove('accessToken')
    message('', '', '로그아웃 완료 알림!')
  }

  const createProfile = (payload: Profile) => {
    api.defaults.headers.post['Content-Type'] = 'multipart/form-data'
    return api
      .post(`/profile/`, payload)
      .then(() => {
        const cookedToken = Cookies.get('accessToken')
        loginByToken(cookedToken).then(() => message())
      })
      .catch(err => errorHandle(err.response.data))
  }

  const patchProfile = (payload: Profile) => {
    api.defaults.headers.patch['Content-Type'] = 'multipart/form-data'
    return api
      .patch(`/profile/${payload.pk}/`, payload)
      .then(() => {
        const cookedToken = Cookies.get('accessToken')
        loginByToken(cookedToken).then(() => message())
      })
      .catch(err => errorHandle(err.response.data))
  }

  const fetchTodoList = () => {
    const url = userInfo.value
      ? `/todo/?user=${userInfo.value.pk}&soft_deleted=false`
      : '/todo/'
    api
      .get(url)
      .then(res => {
        todoList.value = res.data.results
      })
      .catch(err => errorHandle(err.response.data))
  }

  const createTodo = (payload: Todo) =>
    api
      .post('/todo/', payload)
      .then(() => {
        fetchTodoList()
        return api
          .get(`/user/${userInfo.value?.pk}/`)
          .then(res => {
            userInfo.value = res.data
          })
          .catch(err => errorHandle(err.response.data))
      })
      .catch(err => errorHandle(err.response.data))

  const patchTodo = (payload: Todo) =>
    api
      .patch(`/todo/${payload.pk}/`, payload)
      .then(() => {
        fetchTodoList()
      })
      .catch(err => errorHandle(err.response.data))

  const deleteTodo = (pk: number) => {
    api
      .delete(`/todo/${pk}/`)
      .then(() => {
        fetchTodoList()
        return api
          .get(`/user/${userInfo.value?.pk}/`)
          .then(res => {
            userInfo.value = res.data
          })
          .catch(err => errorHandle(err.response.data))
      })
      .catch(err => errorHandle(err.response.data))
  }

  return {
    accessToken,
    userInfo,
    todoList,

    superAuth,
    staffAuth,
    isAuthorized,
    myTodos,

    signup,
    login,
    loginByToken,
    logout,

    createProfile,
    patchProfile,

    fetchTodoList,
    createTodo,
    patchTodo,
    deleteTodo,
  }
})
