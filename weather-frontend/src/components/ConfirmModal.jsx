'use client';

export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm animate-slide-up">
        
        <h3 className="text-lg font-semibold text-white mb-2">
          {title}
        </h3>

        <p className="text-sm text-gray-400 mb-6">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-sm"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm"
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}