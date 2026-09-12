import { FileIcon, ImageIcon, Upload, X } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

interface FileUploadProps extends Omit<React.ComponentProps<"div">, "onChange" | "onError"> {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  value?: File[];
  onChange?: (files: File[]) => void;
  onError?: (message: string) => void;
  error?: boolean;
}

interface UploadedFile {
  file: File;
  preview?: string;
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      className,
      accept,
      multiple = false,
      maxSize = 10 * 1024 * 1024,
      disabled = false,
      value,
      onChange,
      onError,
      error = false,
      ...props
    },
    ref
  ) => {
    const [isDragOver, setIsDragOver] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const files: UploadedFile[] = React.useMemo(() => {
      if (!value) return [];
      return value.map((file) => ({
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      }));
    }, [value]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: cleanup-only effect, value is captured in closure
    React.useEffect(() => {
      return () => {
        for (const f of value ?? []) {
          const preview = f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined;
          if (preview) URL.revokeObjectURL(preview);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validateFile = (file: File): boolean => {
      if (maxSize && file.size > maxSize) {
        onError?.(`File "${file.name}" exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`);
        return false;
      }
      return true;
    };

    const addFiles = (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles).filter(validateFile);
      if (multiple) {
        onChange?.([...(value ?? []), ...fileArray]);
      } else {
        onChange?.(fileArray.slice(0, 1));
      }
    };

    const removeFile = (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      const newFiles = (value ?? []).filter((_, i) => i !== index);
      onChange?.(newFiles);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (!disabled && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {/* biome-ignore lint/a11y/useSemanticElements: custom upload dropzone, not a native button */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload files"
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors",
            "cursor-pointer hover:border-primary/50 hover:bg-primary/5",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            disabled && "cursor-not-allowed opacity-50",
            isDragOver && "border-primary bg-primary/10",
            error ? "border-destructive" : "border-input",
            "min-h-[44px]"
          )}
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-primary">Click to upload</span> or drag and drop
          </div>
          {accept && <div className="text-xs text-muted-foreground">Accepted: {accept}</div>}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
            tabIndex={-1}
            className="sr-only"
          />
        </div>

        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((f, index) => (
              <div
                key={`${f.file.name}-${index}`}
                className="flex items-center gap-3 rounded-md border bg-muted/50 px-3 py-2"
              >
                {f.preview ? (
                  <img
                    src={f.preview}
                    alt={f.file.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                    {f.file.type.startsWith("image/") ? (
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <FileIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{f.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(f.file.size / 1024)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => removeFile(index, e)}
                  className="shrink-0 rounded-md p-1 hover:bg-muted min-h-[44px] min-w-[44px] md:min-h-[28px] md:min-w-[28px] flex items-center justify-center"
                  aria-label={`Remove ${f.file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
FileUpload.displayName = "FileUpload";

export { FileUpload };
