// components/TaskCard.tsx
import {z} from 'zod'
type Task = { id: string; text: string; completed: boolean }
type Props = { title: string; tasks: Task[] }

// 1. Define the schema first
export const schemaOfTasks = z.object({
  title: z.string().describe("The name to create for the task list"),
  tasks: z.array(
    z.object({
      id: z.string(), // Added to match your JSX map key
      text: z.string(),
      completed: z.boolean() // Added to match your conditional rendering
    })
  ).describe("The list of tasks")
});

// 2. Infer the TypeScript type from the Zod schema
type TaskCardProps = z.infer<typeof schemaOfTasks>;

// 3. Apply the inferred type to the component
export function TaskCard({ title = 'Plan', tasks = [] }: TaskCardProps) {
    return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-white shadow-xl w-full max-w-sm">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <h3 className="font-semibold text-zinc-200">{title}</h3>
        {/* <span className="text-xs text-zinc-500">{tasks.length} tasks</span> */}
      </div>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center gap-3">
            <div className={`w-5 h-5 flex items-center justify-center text-xs`}>
                ●
            </div>
            <span className={`text-sm ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-300'}`}>
              {task.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
