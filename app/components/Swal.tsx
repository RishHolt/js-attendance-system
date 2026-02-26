"use client";

import Swal, { type SweetAlertOptions, type SweetAlertResult } from "sweetalert2";

export type { SweetAlertOptions, SweetAlertResult };

export function swal(options: SweetAlertOptions): Promise<SweetAlertResult> {
  return Swal.fire(options);
}
