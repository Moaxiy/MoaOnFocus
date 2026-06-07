"use client";

import { PrimaryButton } from "@/components/common/primary-button";
import { SecondaryButton } from "@/components/common/secondary-button";

type ConfirmDialogProps = {
  eyebrow?: string;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  disabled?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  eyebrow = "Confirm",
  title,
  description,
  confirmLabel,
  cancelLabel = "取消",
  danger = false,
  disabled = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <div className="confirm-dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
      <div className="confirm-dialog-panel paper-shell">
        <div className="confirm-dialog-copy">
          <p className="confirm-dialog-eyebrow">{eyebrow}</p>
          <h2 id="confirm-dialog-title">{title}</h2>
          <p>{description}</p>
        </div>

        <div className="confirm-dialog-actions">
          <SecondaryButton disabled={disabled} onClick={onCancel} type="button">
            {cancelLabel}
          </SecondaryButton>
          <PrimaryButton
            className={danger ? "confirm-dialog-danger" : ""}
            disabled={disabled}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
