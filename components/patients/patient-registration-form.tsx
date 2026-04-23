"use client";

import { useActionState } from "react";

import { createPatientAction, type CreatePatientState } from "@/lib/actions/patient";

const initialState: CreatePatientState = {
  success: false,
  message: "",
};

export function PatientRegistrationForm() {
  const [state, formAction, pending] = useActionState(createPatientAction, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
          {state.errors?.name ? <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p> : null}
        </div>

        <div>
          <label htmlFor="age" className="mb-1 block text-sm font-medium">
            Age
          </label>
          <input
            id="age"
            name="age"
            type="number"
            min={0}
            max={130}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
          {state.errors?.age ? <p className="mt-1 text-xs text-red-600">{state.errors.age[0]}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="gender" className="mb-1 block text-sm font-medium">
          Gender
        </label>
        <select id="gender" name="gender" defaultValue="OTHER" className="w-full rounded-md border border-slate-300 px-3 py-2">
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        {state.errors?.gender ? <p className="mt-1 text-xs text-red-600">{state.errors.gender[0]}</p> : null}
      </div>

      <div>
        <label htmlFor="medicalHistory" className="mb-1 block text-sm font-medium">
          Medical History
        </label>
        <textarea
          id="medicalHistory"
          name="medicalHistory"
          rows={4}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
        {state.errors?.medicalHistory ? (
          <p className="mt-1 text-xs text-red-600">{state.errors.medicalHistory[0]}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Patient Login Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
          {state.errors?.email ? <p className="mt-1 text-xs text-red-600">{state.errors.email[0]}</p> : null}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Temporary Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
          {state.errors?.password ? (
            <p className="mt-1 text-xs text-red-600">{state.errors.password[0]}</p>
          ) : null}
        </div>
      </div>

      {state.message ? (
        <p className={`text-sm ${state.success ? "text-green-700" : "text-red-600"}`}>{state.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
      >
        {pending ? "Saving..." : "Register Patient"}
      </button>
    </form>
  );
}
