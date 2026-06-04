// components/RecipeCard.tsx
import React from "react";
import type { RecipeData } from "@/app/api/chat/schema";

export function RecipeCard({ recipe }: { recipe: Partial<RecipeData> }) {
  return (
    <div className="w-full max-w-full rounded-2xl border border-orange-100 bg-orange-50/30 p-4 sm:p-6 shadow-sm backdrop-blur-md">
      <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 break-words">
        {recipe.title || "Crafting Recipe..."}
      </h2>
      <p className="mt-1 text-sm text-zinc-500 italic">{recipe.description}</p>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-zinc-600">
        {recipe.prepTime && <span>⏳ Prep: {recipe.prepTime}</span>}
        {recipe.cookTime && <span>🍳 Cook: {recipe.cookTime}</span>}
        {recipe.servings && <span>🍽️ Servings: {recipe.servings}</span>}
      </div>

      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-zinc-800">Ingredients</h3>
          <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx} className="flex text-sm text-zinc-600">
                <span className="font-medium text-orange-600 mr-2">
                  {ing?.amount}
                </span>
                <span>{ing?.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recipe.instructions && recipe.instructions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-zinc-800">Instructions</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-4 text-sm text-zinc-600">
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className="pl-1">
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
