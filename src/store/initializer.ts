'use client'

import { useRef } from 'react'

import { Actions, State, useStore } from '.'

type Initializer = Partial<State & Actions>

export default function UserStoreInitializer(props: Initializer) {
  const initialized = useRef(false)
  if (!initialized.current) {
    useStore.setState(props)
    initialized.current = true
  }
  return null
}
