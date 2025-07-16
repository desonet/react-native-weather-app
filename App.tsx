import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Image } from 'react-native';

const API_KEY = '77811b2b77b6b57b13edd51bcaa1cd96'; // ← replace with your OpenWeatherMap API key

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setWeather(null);
    setError('');
  
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
  
      if (!response.ok) {
        throw new Error('City not found');
      }
  
      const data = await response.json();
      console.log('Weather response:', data); // ← add this
      setWeather(data);
    } catch (err: any) {
      console.error('Fetch error:', err); // ← and this
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌤️ Weather App</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        value={city}
        onChangeText={setCity}
      />

      <Button title="Get Weather" onPress={fetchWeather} />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {weather && (
        <View style={styles.result}>
          <Text style={styles.city}>{weather.name}</Text>
          <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
          <Text style={styles.desc}>{weather.weather[0].description}</Text>
          <Image
            style={styles.icon}
            source={{
              uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`,
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  result: {
    alignItems: 'center',
    marginTop: 30,
  },
  city: {
    fontSize: 24,
    fontWeight: '600',
  },
  temp: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 18,
    fontStyle: 'italic',
    textTransform: 'capitalize',
  },
  icon: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
});
