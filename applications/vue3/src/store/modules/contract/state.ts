import { User } from '@/store/modules/accounts/state'
import { Project } from '@/store/modules/project/state'

export interface Contract {
  pk: number
  project: Project
  order_group: OrderGroup
  serial_number: string
  activation: boolean
  created_at: Date
  updted_at: Date
  user: User
}

export interface OrderGroup {
  pk: number
  url: string
  project: number
  order_number: number
  sort: string
  sort_desc: string
  order_group_name: string
}

export interface ContractState {
  contractList: Contract[]
  contract: Contract | null
  orderGroupList: OrderGroup[]
}

const state = {
  contractList: [],
  contract: null,
  orderGroupList: [],
}

export default state
