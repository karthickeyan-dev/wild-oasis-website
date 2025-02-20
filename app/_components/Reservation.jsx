import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import DateSelector from "./DateSelector";
import ReservationForm from "./ReservationForm";

export default async function Reservation({ cabin }) {
  //NOTE  Promise.all is as fast as the slowest request
  const [bookedDates, settings] = await Promise.all([
    getBookedDatesByCabinId(cabin.id),
    getSettings(),
  ]);

  return (
    <div className="grid min-h-[400px] grid-cols-2 border border-primary-800">
      <DateSelector
        cabin={cabin}
        bookedDates={bookedDates}
        settings={settings}
      />
      <ReservationForm cabin={cabin} />
    </div>
  );
}
