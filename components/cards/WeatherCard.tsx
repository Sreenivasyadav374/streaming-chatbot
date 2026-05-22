// components/WeatherCard.tsx

type Props = {
  city: string
  temperature: string
}

export function WeatherCard({
  city,
  temperature,
}: Props) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-white shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-zinc-400">
            Weather
          </p>

          <h2 className="mt-1 text-3xl font-bold">
            {city}
          </h2>
        </div>

        <div className="text-5xl">
          ☀️
        </div>
      </div>

      <div className="mt-8 text-6xl font-bold">
        {temperature}°
      </div>
    </div>
  )
}