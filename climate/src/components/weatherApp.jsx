import { useState, useEffect } from "react";
import WeatherForm from "./weatherForm";
import WeatherMainInfo from "./weatherMainInfo";
import styles from "./weatherApp.module.css";
import Loading from "./loading";

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInfo();
  }, []);

  useEffect(() => {
    document.title = `Weather | ${weather?.location.name ?? ""}`;
  }, [weather]);

  async function loadInfo(city = "London") {
    try {
      const url = `https://corsproxy.io/?${import.meta.env.VITE_APP_URL}?key=${
        import.meta.env.VITE_APP_KEY
      }&q=${city}&aqi=no`;
      console.log("Fetching URL:", url); // Imprime la URL para verificar

      const response = await fetch(url);

      if (!response.ok) {
        // Manejo de errores HTTP
        throw new Error(
          `The city you are looking for is not found, try again.`
        );
      }

      const json = await response.json();

      if (json.error) {
        // Manejo de errores específicos de la API
        throw new Error(json.error.message);
      }

      console.log(json); // Imprime los datos en la consola

      setTimeout(() => {
        setWeather(json); // Establece el estado del clima después de 2 segundos
        setError(null); // Limpia el error en caso de éxito
      }, 1500);
    } catch (error) {
      console.error("Error fetching weather data:", error); // Manejo de errores
      setError(error.message); // Establece el mensaje de error
    }
  }

  function handleChangeCity(city) {
    console.log("City changed to:", city); // Verifica si la ciudad está cambiando
    setWeather(null);
    setError(null); // Limpia el error al cambiar la ciudad
    loadInfo(city);
  }

  return (
    <div className={styles.weatherContainer}>
      <WeatherForm onChangeCity={handleChangeCity} />
      {error && <div className={styles.error}>{error}</div>}{" "}
      {/* Muestra el error si existe */}
      {weather ? <WeatherMainInfo weather={weather} /> : <Loading />}
    </div>
  );
}
