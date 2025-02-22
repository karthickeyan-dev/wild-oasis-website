"use client";

import { useFormStatus } from "react-dom";
import updateReservation from "../_lib/action";

export default function ReservationEditForm({
  numGuests,
  observations,
  maxCapacity,
  bookingId,
}) {
  return (
    <form
      action={updateReservation}
      className="flex flex-col gap-6 bg-primary-900 px-12 py-8 text-lg"
    >
      <div className="space-y-2">
        <label htmlFor="numGuests">How many guests?</label>
        <select
          name="numGuests"
          id="numGuests"
          defaultValue={numGuests}
          className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm"
          required
        >
          <option value="" key="">
            Select number of guests...
          </option>
          {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
            <option value={x} key={x}>
              {x} {x === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="observations">
          Anything we should know about your stay?
        </label>
        <textarea
          name="observations"
          defaultValue={observations}
          className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm"
        />
      </div>

      <input type="text" hidden name="bookingId" defaultValue={bookingId} />
      <SubmitButton />
    </form>
  );
}

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div className="flex items-center justify-end gap-6">
      <button
        disabled={pending}
        className="bg-accent-500 px-8 py-4 font-semibold text-primary-800 transition-all hover:bg-accent-600 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
      >
        {pending ? "Updating..." : "Update reservation"}
      </button>
    </div>
  );
}
