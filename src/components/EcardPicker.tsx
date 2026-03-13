"use client";

import { ecardTemplates } from "@/ecards/templates";
import { config } from "@/config";

interface EcardPickerProps {
  selected: string | null;
  ecardMessage: string;
  guestName: string;
  onSelect: (id: string | null) => void;
  onMessageChange: (msg: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function EcardPicker({
  selected,
  ecardMessage,
  guestName,
  onSelect,
  onMessageChange,
  onContinue,
  onBack,
}: EcardPickerProps) {
  const SelectedComponent = selected
    ? ecardTemplates.find((t) => t.id === selected)?.component
    : null;

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer text-sm text-[#2C2C2C]/50 hover:text-[#2C2C2C]/80"
      >
        &larr; Back
      </button>

      <div className="text-center">
        <p className="text-sm font-medium text-[#2C2C2C]/70">
          Attach an e-card? (optional)
        </p>
        <p className="text-xs text-[#2C2C2C]/40">
          Pick a design or skip to continue
        </p>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {ecardTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() =>
              onSelect(selected === template.id ? null : template.id)
            }
            className={`flex cursor-pointer flex-col items-center gap-1 rounded-lg border p-2 transition-colors ${
              selected === template.id
                ? "border-[#2D8B6E] bg-[#2D8B6E]/10"
                : "border-[#2C2C2C]/10 hover:border-[#2C2C2C]/30"
            }`}
          >
            <span className="text-2xl">{template.preview}</span>
            <span className="text-[10px] text-[#2C2C2C]/50">
              {template.name.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#2C2C2C]/70">
              Card message
            </label>
            <textarea
              value={ecardMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-lg border border-[#2C2C2C]/10 px-4 py-3 text-sm text-[#2C2C2C] outline-none focus:border-[#2D8B6E] focus:ring-1 focus:ring-[#2D8B6E]"
              placeholder="Write a message for your card..."
            />
          </div>

          {SelectedComponent && (
            <div>
              <p className="mb-2 text-xs text-[#2C2C2C]/40">Preview</p>
              <SelectedComponent
                guestName={guestName}
                coupleName={config.coupleName}
                message={ecardMessage}
              />
            </div>
          )}
        </>
      )}

      <button
        onClick={onContinue}
        className="w-full cursor-pointer rounded-lg px-6 py-4 text-center font-medium text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: config.theme.primaryColor }}
      >
        {selected ? "Attach Card & Continue" : "Skip — Continue Without Card"}
      </button>
    </div>
  );
}
