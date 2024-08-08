import api from '@/api'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { message, errorHandle } from '@/utils/helper'
import type {
  Group,
  Board,
  PostCategory,
  PostLink,
  PostFile,
  PatchPost,
  Post,
  Comment as Cm,
  TrashPost as TP,
} from '@/store/types/board'
import { useAccount } from '@/store/pinia/account'

export type PostFilter = {
  company?: number | ''
  project?: number | ''
  board?: number
  is_notice?: boolean | ''
  is_com?: boolean
  category?: number | ''
  lawsuit?: number | ''
  user?: number | ''
  ordering?: string
  search?: string
  page?: number
}

export const useBoard = defineStore('board', () => {
  // state & getters
  const groupList = ref<Group[]>([])

  const fetchGroupList = () =>
    api
      .get('/group/')
      .then(res => (groupList.value = res.data.results))
      .catch(err => errorHandle(err.response.data))

  const createGroup = () => 2
  const updateGroup = () => 3
  const deleteGroup = () => 4

  const board = ref<Board | null>(null)
  const boardList = ref<Board[]>([])

  const fetchBoard = (pk: number) =>
    api
      .get(`/board/${pk}/`)
      .then(res => (board.value = res.data))
      .catch(err => errorHandle(err.response.data))

  const fetchBoardList = () =>
    api
      .get('/board/')
      .then(res => (boardList.value = res.data.results))
      .catch(err => errorHandle(err.response.data))

  const createBoard = () => 2
  const updateBoard = () => 3
  const deleteBoard = () => 4

  const categoryList = ref<PostCategory[]>([])

  const fetchCategoryList = (board: number) =>
    api
      .get(`/post-category/?board=${board}`)
      .then(res => (categoryList.value = res.data.results))
      .catch(err => errorHandle(err.response.data))

  const createCategory = () => 2
  const updateCategory = () => 3
  const deleteCategory = () => 4

  const accStore = useAccount()
  const post = ref<Post | null>(null)
  const postList = ref<Post[]>([])
  const noticeList = ref<Post[]>([])
  const postCount = ref(0)
  const getPostNav = computed(() =>
    postList.value.map(p => ({
      pk: p.pk,
      prev_pk: p.prev_pk,
      next_pk: p.next_pk,
    })),
  )

  const postPages = (itemsPerPage: number) => Math.ceil(postCount.value / itemsPerPage)

  const fetchPost = async (pk: number) =>
    api
      .get(`/post/${pk}/`)
      .then(res => {
        post.value = res.data
        fetchCommentList({ post: pk })
      })
      .catch(err => errorHandle(err.response.data))

  const fetchNoticeList = async (board: number | undefined) => {
    let url = `/post/?is_notice=true`
    url = board ? `${url}&board=${board}` : url
    return await api
      .get(url)
      .then(res => (noticeList.value = res.data.results))
      .catch(err => errorHandle(err.response.data))
  }

  const fetchPostList = async (payload: PostFilter) => {
    const { board, page } = payload
    let url = `/post/?page=${page ?? 1}&is_notice=false`
    if (payload.board) url += `&board=${board}`
    if (payload.company) url += `&company=${payload.company}`
    if (payload.is_com) url += `&is_com=${payload.is_com}`
    if (payload.project) url += `&project=${payload.project}`
    if (payload.category) url += `&category=${payload.category}`
    if (payload.lawsuit) url += `&lawsuit=${payload.lawsuit}`
    if (payload.user) url += `&user=${payload.user}`
    if (payload.ordering) url += `&ordering=${payload.ordering}`
    if (payload.search) url += `&search=${payload.search}`
    await fetchNoticeList(board)

    return await api
      .get(url)
      .then(res => {
        postList.value = res.data.results
        postCount.value = res.data.count
      })
      .catch(err => errorHandle(err.response.data))
  }

  const config_headers = { headers: { 'Content-Type': 'multipart/form-data' } }

  const createPost = (
    payload: {
      form: FormData
    } & {
      isProject?: boolean
    },
  ) =>
    api
      .post(`/post/`, payload.form, config_headers)
      .then(async res => {
        await fetchPostList({
          company: res.data.company,
          project: res.data.project,
          board: res.data.board,
          is_com: !payload.isProject,
          page: 1,
        })
        message()
      })
      .catch(err => errorHandle(err.response.data))

  const updatePost = (
    payload: {
      pk: number
      form: FormData
    } & {
      isProject?: boolean
    },
  ) =>
    api
      .put(`/post/${payload.pk}/`, payload.form, config_headers)
      .then(async res => {
        await fetchPostList({
          company: res.data.company,
          project: res.data.project,
          board: res.data.board,
          is_com: !payload.isProject,
          page: 1,
        })
        await fetchPost(res.data.pk)
        message()
      })
      .catch(err => errorHandle(err.response.data))

  const patchPost = async (
    payload: PatchPost & {
      filter?: PostFilter
    },
  ) => {
    const { filter, ...data } = payload
    return await api
      .patch(`/post/${data.pk}/`, data)
      .then(res =>
        fetchPostList({
          company: res.data.company,
          ...filter,
        }).then(() => fetchPost(res.data.pk)),
      )
      .catch(err => errorHandle(err.response.data))
  }

  const patchPostLike = (pk: number) =>
    api
      .patch(`/post-like/${pk}/`, { pk })
      .then(() => accStore.fetchProfile().then(() => fetchPost(pk)))
      .catch(err => errorHandle(err.response.data))

  const patchPostBlame = (pk: number) =>
    api
      .patch(`/post-blame/${pk}/`, { pk })
      .then(() => accStore.fetchProfile().then(() => fetchPost(pk)))
      .catch(err => errorHandle(err.response.data))

  const copyPost = (payload: { post: number; board: number; project: number | null }) =>
    api
      .post(`post/${payload.post}/copy/`, payload)
      .then(() => message('success', '', '게시물 복사가 완료되었습니다.'))
      .catch(err => errorHandle(err.response.data))

  const deletePost = (pk: number, filter: PostFilter) =>
    api
      .delete(`/post/${pk}/`)
      .then(() =>
        fetchPostList(filter).then(() =>
          message('warning', '', '해당 게시물이 휴지통으로 삭제되었습니다.'),
        ),
      )
      .catch(err => errorHandle(err.response.data))

  // state
  const trashPost = ref<TP | null>(null)
  const trashPostList = ref<TP[]>([])
  const trashPostCount = ref(0)

  const trashPostPages = (itemsPerPage: number) => Math.ceil(trashPostCount.value / itemsPerPage)

  const fetchTrashPost = async (pk: number) =>
    api
      .get(`/post-trash-can/${pk}/`)
      .then(res => {
        trashPost.value = res.data
        fetchCommentList({ post: pk })
      })
      .catch(err => errorHandle(err.response.data))

  const fetchTrashPostList = (page = 1) =>
    api
      .get(`/post-trash-can/?page=${page}`)
      .then(res => {
        trashPostList.value = res.data.results
        trashPostCount.value = res.data.count
      })
      .catch(err => errorHandle(err.response.data))

  const restorePost = (pk: number, isProject = false) =>
    api
      .patch(`/post-trash-can/${pk}/`)
      .then(res =>
        fetchPostList({
          company: res.data.company,
          project: res.data.project,
          board: res.data.board,
          is_com: !isProject,
          page: 1,
        }).then(() =>
          fetchTrashPostList().then(() =>
            message('success', '', '해당 게시물 휴지통에서 복원되었습니다.'),
          ),
        ),
      )
      .catch(err => errorHandle(err.response.data))

  const link = ref<PostLink | null>(null)

  const fetchLink = (pk: number) =>
    api
      .get(`/post-link/${pk}/`)
      .then(res => (link.value = res.data))
      .catch(err => errorHandle(err.response.data))

  const patchLink = (payload: PostLink) =>
    api
      .patch(`/post-link/${payload.pk}/`, payload)
      .then(res => fetchPost(res.data.post))
      .catch(err => errorHandle(err.response.data))

  const file = ref<PostFile | null>(null)

  const fetchFile = (pk: number) =>
    api
      .get(`/post-file/${pk}/`)
      .then(res => (file.value = res.data))
      .catch(err => errorHandle(err.response.data))

  const patchFile = (payload: PostFile) =>
    api
      .patch(`/post-file/${payload.pk}/`, payload)
      .then(res => fetchPost(res.data.post))
      .catch(err => errorHandle(err.response.data))

  const comment = ref<Cm | null>(null)
  const commentList = ref<Cm[]>([])
  const commentCount = ref(0)

  const fetchComment = (pk: number) =>
    api
      .get(`/comment/${pk}/`)
      .then(res => (comment.value = res.data))
      .catch(err => errorHandle(err.response.data))

  const fetchCommentList = async (payload: { post?: number; user?: number; page?: number }) => {
    const { post, user, page } = payload
    let url = `/comment/?page=${page ?? 1}`
    url = post ? `${url}&post=${post}&is_comment=true` : url
    url = user ? `${url}&user=${user}` : url

    return await api
      .get(url)
      .then(res => {
        commentList.value = res.data.results
        commentCount.value = res.data.count
      })
      .catch(err => errorHandle(err.response.data))
  }

  const createComment = (payload: Cm) =>
    api
      .post(`/comment/`, payload)
      .then(res => fetchPost(res.data.post.pk).then(() => message()))
      .catch(err => errorHandle(err.response.data))

  const patchComment = (payload: Cm) =>
    api
      .patch(`/comment/${payload.pk}/`, payload)
      .then(res => fetchPost(res.data.post.pk).then(() => message()))
      .catch(err => errorHandle(err.response.data))

  const patchCommentLike = (pk: number, post: number, page = 1) =>
    api
      .patch(`/comment-like/${pk}/`, { pk })
      .then(() => accStore.fetchProfile().then(() => fetchCommentList({ post, page })))
      .catch(err => errorHandle(err.response.data))

  const patchCommentBlame = (pk: number, post: number, page = 1) =>
    api
      .patch(`/comment-blame/${pk}/`, { pk })
      .then(() => accStore.fetchProfile().then(() => fetchCommentList({ post, page })))
      .catch(err => errorHandle(err.response.data))

  const deleteComment = (payload: { pk: number; post: number }) =>
    api
      .delete(`/comment/${payload.pk}/`)
      .then(() => fetchPost(payload.post).then(() => message()))
      .catch(err => errorHandle(err.response.data))

  const tag = ref(null)

  const fetchTag = () => 1
  const createTag = () => 2
  const updateTag = () => 3
  const deleteTag = () => 4

  return {
    groupList,

    fetchGroupList,
    createGroup,
    updateGroup,
    deleteGroup,

    board,
    boardList,

    fetchBoard,
    fetchBoardList,
    createBoard,
    updateBoard,
    deleteBoard,

    categoryList,

    fetchCategoryList,
    createCategory,
    updateCategory,
    deleteCategory,

    post,
    postList,
    noticeList,
    postCount,
    getPostNav,

    postPages,
    fetchPost,
    fetchPostList,
    createPost,
    updatePost,
    patchPost,
    patchPostLike,
    patchPostBlame,
    copyPost,
    deletePost,

    trashPost,
    trashPostList,
    trashPostCount,

    trashPostPages,
    fetchTrashPost,
    fetchTrashPostList,
    restorePost,

    link,
    fetchLink,
    patchLink,

    file,
    fetchFile,
    patchFile,

    comment,
    commentList,
    commentCount,

    fetchComment,
    fetchCommentList,
    createComment,
    patchComment,
    patchCommentLike,
    patchCommentBlame,
    deleteComment,

    tag,

    fetchTag,
    createTag,
    updateTag,
    deleteTag,
  }
})
