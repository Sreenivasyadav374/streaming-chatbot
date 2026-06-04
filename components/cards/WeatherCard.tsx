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
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 text-white shadow-xl w-full max-w-full">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-zinc-400 text-sm">
            Weather
          </p>

          <h2 className="mt-1 text-2xl sm:text-3xl font-bold truncate">
            {city}
          </h2>
        </div>

        <div className="text-4xl sm:text-5xl shrink-0 ml-2">
          ☀️
        </div>
      </div>

      <div className="mt-6 sm:mt-8 text-5xl sm:text-6xl font-bold">
        {temperature}°
      </div>
    </div>
  )
}