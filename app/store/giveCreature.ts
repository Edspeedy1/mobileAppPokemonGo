import { creatures as allCreatures } from '../../assets/creatures'
import useGameStore from './useGameStore'

export function useGiveCreature() {
  const catchCreature = useGameStore((state) => state.catchCreature)
  const caughtList = useGameStore((state) => state.caughtList)

  return () => {
    const uncaught = allCreatures.filter(
      (c) => !caughtList.includes(c.id)
    )
    if (uncaught.length === 0) return null

    const randomCreature =
      uncaught[Math.floor(Math.random() * uncaught.length)]

    catchCreature({
      id: randomCreature.id.toString(),
      name: randomCreature.name,
      size: Math.floor(Math.random() * 100) + 10,
      weight: Math.floor(Math.random() * 100) + 10,
    })

    return randomCreature
  }
}

export function removeCreature(id: string) {
  useGameStore.setState((state) => {
    const index = state.creatures.findLastIndex((c) => c.name === id)
    console.log(index)
    if (index === -1) return state
    state.creatures.splice(index, 1)
    return state
  })
}