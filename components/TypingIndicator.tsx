export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 px-4 py-3 bg-secondary/50 rounded-2xl max-w-[100px]">
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
          style={{ animationDelay: '0ms' }}
        ></div>
        <div
          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
          style={{ animationDelay: '150ms' }}
        ></div>
        <div
          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
          style={{ animationDelay: '300ms' }}
        ></div>
      </div>
    </div>
  );
}
