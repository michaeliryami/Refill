import { StatusBar } from 'expo-status-bar';
import { MapScreen } from './src/screens/MapScreen';

/**
 * Main Application Component
 * 
 * Entry point for the Refill mobile application.
 * Built with React Native and Expo for cross-platform support.
 * 
 * Refill helps users find restaurants with free amenities like:
 * - Free refills (fountain drinks)
 * - Bread baskets (unlimited)
 * - Pay at table options
 * - Bathroom attendants
 * 
 * @returns {JSX.Element} The root application component
 */
export default function App(): JSX.Element {
  return (
    <>
      <MapScreen />
      <StatusBar style="dark" />
    </>
  );
}
