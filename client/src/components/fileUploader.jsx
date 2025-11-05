import React from 'react';
import { Controller } from 'react-hook-form';

export default function FileUploader({ control, name, accept = '.jpg,.jpeg,.png', maxSize = 500 * 1024, minSize = 10 * 1024 }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div>
          <input
            type="file"
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              if (!file) {
                field.onChange(null);
                return;
              }
              if (file.size < minSize || file.size > maxSize) {
                field.onChange(null);
                return;
              }
              field.onChange(file);
            }}
            className="w-full"
          />
          {fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
        </div>
      )}
    />
  );
}
