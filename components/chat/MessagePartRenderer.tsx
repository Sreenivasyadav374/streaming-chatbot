import { WeatherCard } from "../cards/WeatherCard";
import { TaskCard } from "../cards/TaskCard";
import { RecipeCard } from "../cards/RecipeCard";
import { MarkdownRenderer } from "./MarkDownRenderer";

export function MessagePartRenderer({ part, role }: any) {
  if (part.type === "text") {
    return <MarkdownRenderer text={part.text} role={role} />;
  }

  if (part.type === "tool-showWeather" && part.state === "output-available") {
    return (
      <WeatherCard
        city={part.output.city}
        temperature={part.output.temperature}
      />
    );
  }

  if (part.type === "tool-showTasks" && part.state === "output-available") {
    return <TaskCard title={part.output.title} tasks={part.output.tasks} />;
  }

  if (part.type === "tool-showRecipe" && part.state === "output-available") {
    return <RecipeCard recipe={part.output} />;
  }

  if (part.type === "file") {
    return (
      <img
        src={part.url}
        alt={part.filename ?? "uploaded image"}
        className="max-w-sm rounded-2xl border border-zinc-200"
      />
    );
  }

  return null;
}
