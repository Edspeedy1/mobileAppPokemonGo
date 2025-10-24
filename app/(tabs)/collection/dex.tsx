import { ScrollView, StyleSheet } from 'react-native'
import { creatures } from '../../../assets/creatures'
import CreatureCard from '../../../components/CreatureCard'
import useGameStore from '../../store/useGameStore'

export default function DexScreen() {
  const caughtList = useGameStore((state) => state.caughtList) // get caught IDs

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {creatures.map((entry) => (
        <CreatureCard
          key={entry.id}
          name={entry.name}
          image={entry.image}
          discovered={caughtList.includes(entry.id)} // 👈 true if caught
        />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
})
