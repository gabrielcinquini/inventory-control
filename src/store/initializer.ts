'use client'

import { Actions, useStore, State } from '.'
import { useRef } from 'react'

type Initializer = Partial<State & Actions>

export default function UserStoreInitializer(props: Initializer) {
  const initialized = useRef(false)
  if (!initialized.current) {
    useStore.setState(props)
    initialized.current = true
  }
  return null
}
