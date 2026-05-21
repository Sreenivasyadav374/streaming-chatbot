// components/weather-card.tsx
export const WeatherCard = ({ city, temp }: { city: string, temp: string }) => (
  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
    <h3 className="font-bold">{city}</h3>
    <p className="text-2xl">{temp}°C</p>
  </div>
);
