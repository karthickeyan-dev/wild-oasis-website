"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { redirect } from "next/navigation";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateProfile(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = { nationality, nationalID, countryFlag };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

export async function createReservation(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const updateData = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations"),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  console.log(updateData);

  const { error } = await supabase.from("bookings").insert([updateData]);

  if (error) throw new Error("Reservation could not be created");

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thank-you");
}

export default async function updateReservation(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const bookingId = Number(formData.get("bookingId"));
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations"),
  };

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .eq("guestId", session.user.guestId);

  if (error) throw new Error("Reservation could not be updated");

  revalidatePath(`/account/reservations/${bookingId}`);
  redirect("/account/reservations");
}

export async function deleteReservation(id) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id)
    .eq("guestId", session.user.guestId);

  if (error) throw new Error("Reservation could not be deleted");

  revalidatePath("/account/reservations");
}
