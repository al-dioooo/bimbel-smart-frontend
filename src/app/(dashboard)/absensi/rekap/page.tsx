import { redirect } from "next/navigation"

/**
 * Placeholder route kept as a redirect: the real attendance summary lives at
 * /report/absensi. The original page was 80 repeated "Rekap Absensi" divs and
 * was not linked from anywhere.
 */
export default function RekapAbsensiPage() {
    redirect("/report/absensi")
}
