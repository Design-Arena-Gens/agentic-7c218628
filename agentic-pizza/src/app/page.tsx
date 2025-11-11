"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, Loader2, Sparkles, Truck, Utensils } from "lucide-react";

type Option<T extends string> = {
  id: T;
  label: string;
  description?: string;
  price: number;
};

const sizes: Option<
  "personal" | "regular" | "large" | "party"
>[] = [
  {
    id: "personal",
    label: "Personal 9\"",
    description: "Perfect solo classic with 6 slices.",
    price: 9,
  },
  {
    id: "regular",
    label: "Regular 12\"",
    description: "Our most popular, feeds 2 comfortably.",
    price: 14.5,
  },
  {
    id: "large",
    label: "Large 15\"",
    description: "Great for sharing with your crew.",
    price: 18,
  },
  {
    id: "party",
    label: "Party 18\"",
    description: "Game-night favorite, 12 big slices.",
    price: 23,
  },
];

const crusts: Option<"hand_tossed" | "thin" | "stuffed" | "gluten_free">[] = [
  {
    id: "hand_tossed",
    label: "Hand Tossed",
    description: "Soft inside, charred edge, our signature dough.",
    price: 0,
  },
  {
    id: "thin",
    label: "Crispy Thin",
    description: "Cracker-thin artisan crisp with olive oil finish.",
    price: 1,
  },
  {
    id: "stuffed",
    label: "Stuffed Crust",
    description: "Mozzarella-filled crust for extra indulgence.",
    price: 3.5,
  },
  {
    id: "gluten_free",
    label: "Gluten-Friendly",
    description: "House rice flour blend, baked separately.",
    price: 3,
  },
];

const sauces: Option<"marinara" | "pesto" | "alfredo" | "detroit">[] = [
  { id: "marinara", label: "Slow Simmered Marinara", price: 0 },
  { id: "pesto", label: "Basil Pesto", price: 1.5 },
  { id: "alfredo", label: "Roasted Garlic Alfredo", price: 2 },
  {
    id: "detroit",
    label: "Crushed Tomato Detroit Red",
    description: "Brick cheese edges, sauce on top.",
    price: 1,
  },
];

const toppings: Option<
  | "buffalo_mozz"
  | "smoked_prov"
  | "pepperoni"
  | "calabrese"
  | "smoked_chicken"
  | "roasted_mushrooms"
  | "pickled_jalapenos"
  | "charred_broccolini"
  | "heirloom_tomatoes"
  | "pineapple"
  | "truffle_honey"
>[] = [
  {
    id: "buffalo_mozz",
    label: "Buffalo Mozzarella",
    price: 2.5,
  },
  {
    id: "smoked_prov",
    label: "Applewood Smoked Provolone",
    price: 2,
  },
  { id: "pepperoni", label: "Curling Pepperoni Cups", price: 1.8 },
  { id: "calabrese", label: "Spicy Calabrese", price: 2 },
  { id: "smoked_chicken", label: "Smoked Chicken", price: 2.3 },
  { id: "roasted_mushrooms", label: "Wood-Fired Mushrooms", price: 1.6 },
  {
    id: "pickled_jalapenos",
    label: "House Pickled Jalapeños",
    price: 1.4,
  },
  {
    id: "charred_broccolini",
    label: "Charred Broccolini",
    price: 1.7,
  },
  { id: "heirloom_tomatoes", label: "Heirloom Tomatoes", price: 1.5 },
  { id: "pineapple", label: "Roasted Pineapple", price: 1.5 },
  { id: "truffle_honey", label: "Truffle Honey Drizzle", price: 1.2 },
];

const extras: Option<"garlic_knots" | "tiramisu" | "blood_orange_soda">[] = [
  {
    id: "garlic_knots",
    label: "Parmesan Garlic Knots",
    description: "Six knots with whipped marinara butter.",
    price: 6.5,
  },
  {
    id: "tiramisu",
    label: "Espresso Tiramisu Jar",
    description: "Ladyfingers, mascarpone, cocoa dust.",
    price: 7,
  },
  {
    id: "blood_orange_soda",
    label: "Blood Orange Italian Soda",
    description: "House-made syrup, fresh herbs, crushed ice.",
    price: 4.5,
  },
];

const experiences = [
  {
    title: "Ultra-Fast Delivery",
    description:
      "Fresh pizza in 25 minutes or less inside the delivery zone. Optimized for crisp crusts with insulated bags.",
    icon: <Truck className="size-5" />,
  },
  {
    title: "Pickup Lounge",
    description:
      "Skip the wait, grab from the heated pickup cubbies with digital check-in. Perfect for on-the-go heroes.",
    icon: <Utensils className="size-5" />,
  },
  {
    title: "Chef Signature",
    description:
      "Inspired by seasonal produce from local farms. New limited drops every Friday at noon.",
    icon: <Sparkles className="size-5" />,
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function Home() {
  const [size, setSize] = useState<(typeof sizes)[number]["id"]>("regular");
  const [crust, setCrust] =
    useState<(typeof crusts)[number]["id"]>("hand_tossed");
  const [sauce, setSauce] =
    useState<(typeof sauces)[number]["id"]>("marinara");
  const [selectedToppings, setSelectedToppings] = useState<
    Set<(typeof toppings)[number]["id"]>
  >(new Set<(typeof toppings)[number]["id"]>(["buffalo_mozz", "pepperoni"]));
  const [extraSelections, setExtraSelections] = useState<
    Set<(typeof extras)[number]["id"]>
  >(new Set<(typeof extras)[number]["id"]>());
  const [notes, setNotes] = useState("");
  const [service, setService] = useState<"delivery" | "pickup">("delivery");
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [isPending, startTransition] = useTransition();
  const [confirmation, setConfirmation] = useState<{
    reference: string;
    eta: string;
  } | null>(null);
  const [historyVersion, setHistoryVersion] = useState(0);

  const total = useMemo(() => {
    const sizePrice = sizes.find((option) => option.id === size)?.price ?? 0;
    const crustPrice = crusts.find((option) => option.id === crust)?.price ?? 0;
    const saucePrice = sauces.find((option) => option.id === sauce)?.price ?? 0;
    const toppingPrice = Array.from(selectedToppings).reduce((sum, id) => {
      const toppingPrice = toppings.find((t) => t.id === id)?.price ?? 0;
      return sum + toppingPrice;
    }, 0);
    const extraPrice = Array.from(extraSelections).reduce((sum, id) => {
      const extraPrice = extras.find((extra) => extra.id === id)?.price ?? 0;
      return sum + extraPrice;
    }, 0);
    const serviceFee = service === "delivery" ? 3.75 : 0;
    return sizePrice + crustPrice + saucePrice + toppingPrice + extraPrice + serviceFee;
  }, [crust, extraSelections, sauce, selectedToppings, service, size]);

  const handleToggleTopping = (id: (typeof toppings)[number]["id"]) => {
    setSelectedToppings((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleExtra = (id: (typeof extras)[number]["id"]) => {
    setExtraSelections((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const snapshot = {
      size,
      crust,
      sauce,
      toppings: Array.from(selectedToppings),
      extras: Array.from(extraSelections),
      notes,
      service,
      customer,
      total,
    };
    startTransition(() => {
      setConfirmation(null);
      const reference =
        "AP-" +
        Math.random().toString(36).slice(2, 5).toUpperCase() +
        Math.random().toString(36).slice(2, 5).toUpperCase();
      const eta =
        service === "delivery" ? "Approx. 32 minutes" : "Ready in 15 minutes";
      // Simulated background fulfillment log to localStorage.
      try {
        const previous = JSON.parse(
          window.localStorage.getItem("agentic-orders") ?? "[]",
        ) as unknown[];
        window.localStorage.setItem(
          "agentic-orders",
          JSON.stringify([
            { ...snapshot, reference, eta, time: new Date().toISOString() },
            ...previous,
          ].slice(0, 5)),
        );
      } catch (error) {
        console.warn("Unable to persist order history", error);
      }
      setTimeout(() => {
        setConfirmation({ reference, eta });
        setHistoryVersion((current) => current + 1);
      }, 950);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black px-4 py-10 text-zinc-100 sm:px-8">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-8">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-red-900/20 backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-red-300/80">
                  Agentic Pizza Studio
                </p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Build your dream pizza, faster than delivery.
                </h1>
                <p className="mt-4 max-w-xl text-base text-zinc-200">
                  Choose from our seasonal ingredients and experience the
                  chef-driven pie that arrives still sizzling. Save presets,
                  order again in a click, and track every step.
                </p>
              </div>
              <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-6 py-5 text-sm text-red-100 shadow-inner shadow-red-900/40">
                <p className="font-medium text-red-100">
                  Tonight&apos;s Drop
                </p>
                <p className="mt-2 text-sm leading-relaxed text-red-50/80">
                  Wood-fired Vesuvio pepperoni, charred broccolini, truffle
                  honey finish. Pre-configured below as &quot;Chef Signature&quot;.
                </p>
              </div>
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-xl shadow-black/40 backdrop-blur"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Customize
                </h2>
                <p className="text-sm text-zinc-300">
                  Select size, crust, and flavor profile to craft perfection.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.2em] text-zinc-300">
                <Sparkles className="size-4 text-amber-300" />
                Real-time total updates
              </div>
            </div>

            <fieldset className="space-y-4">
              <legend className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-400">
                Choose Size
              </legend>
              <div className="grid gap-4 md:grid-cols-2">
                {sizes.map((option) => {
                  const active = option.id === size;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSize(option.id)}
                      className={`group rounded-2xl border p-5 text-left transition-all ${
                        active
                          ? "border-red-400/80 bg-red-500/20 shadow-lg shadow-red-900/40"
                          : "border-white/10 bg-white/5 hover:border-red-300/60 hover:bg-red-500/10"
                      }`}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-white">
                          {option.label}
                        </span>
                        <span className="text-red-200">
                          {formatCurrency(option.price)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-zinc-300">
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-400">
                Select Crust
              </legend>
              <div className="grid gap-4 md:grid-cols-2">
                {crusts.map((option) => {
                  const active = option.id === crust;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setCrust(option.id)}
                      className={`rounded-2xl border p-5 text-left transition-all ${
                        active
                          ? "border-red-400/70 bg-red-500/20 shadow-md shadow-red-900/30"
                          : "border-white/10 bg-white/5 hover:border-red-300/60 hover:bg-red-500/10"
                      }`}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-white">
                          {option.label}
                        </span>
                        {option.price > 0 ? (
                          <span className="text-red-200">
                            +{formatCurrency(option.price)}
                          </span>
                        ) : (
                          <span className="text-zinc-300">Included</span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-zinc-300">
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-400">
                Sauce Base
              </legend>
              <div className="grid gap-4 md:grid-cols-2">
                {sauces.map((option) => {
                  const active = option.id === sauce;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSauce(option.id)}
                      className={`rounded-2xl border p-5 text-left transition ${
                        active
                          ? "border-emerald-400/70 bg-emerald-500/20 shadow-md shadow-emerald-900/40"
                          : "border-white/10 bg-white/5 hover:border-emerald-300/70 hover:bg-emerald-500/10"
                      }`}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-white">
                          {option.label}
                        </span>
                        {option.price > 0 ? (
                          <span className="text-emerald-200">
                            +{formatCurrency(option.price)}
                          </span>
                        ) : (
                          <span className="text-zinc-300">Included</span>
                        )}
                      </div>
                      {option.description ? (
                        <p className="mt-2 text-sm text-zinc-300">
                          {option.description}
                        </p>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-400">
                Toppings
              </legend>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {toppings.map((option) => {
                  const active = selectedToppings.has(option.id);
                  return (
                    <label
                      key={option.id}
                      className={`group flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm transition ${
                        active
                          ? "border-amber-400/70 bg-amber-500/10 shadow-md shadow-amber-900/30"
                          : "border-white/10 bg-white/5 hover:border-amber-300/60 hover:bg-amber-500/10"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => handleToggleTopping(option.id)}
                        className="mt-1 size-4 rounded border-zinc-500 bg-black/20 text-amber-400 focus:ring-amber-300"
                      />
                      <div>
                        <div className="flex items-center justify-between gap-2 font-semibold text-white">
                          <span>{option.label}</span>
                          <span className="text-amber-200">
                            +{formatCurrency(option.price)}
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-400">
                Extras
              </legend>
              <div className="grid gap-4 md:grid-cols-3">
                {extras.map((extra) => {
                  const active = extraSelections.has(extra.id);
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => handleToggleExtra(extra.id)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-sky-400/70 bg-sky-500/15 shadow-md shadow-sky-900/40"
                          : "border-white/10 bg-white/5 hover:border-sky-300/60 hover:bg-sky-500/10"
                      }`}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-white">
                          {extra.label}
                        </span>
                        <span className="text-sky-200">
                          +{formatCurrency(extra.price)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-zinc-300">
                        {extra.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300">
                  Experience
                </h3>
                <div className="flex rounded-full border border-white/10 bg-black/40 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setService("delivery")}
                    className={`w-1/2 rounded-full px-3 py-2 font-semibold transition ${
                      service === "delivery"
                        ? "bg-white text-black"
                        : "text-zinc-300 hover:text-white"
                    }`}
                  >
                    Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setService("pickup")}
                    className={`w-1/2 rounded-full px-3 py-2 font-semibold transition ${
                      service === "pickup"
                        ? "bg-white text-black"
                        : "text-zinc-300 hover:text-white"
                    }`}
                  >
                    Pickup
                  </button>
                </div>
                <p className="text-xs text-zinc-300">
                  {service === "delivery"
                    ? "Includes insulated courier service within a 4-mile radius."
                    : "Skip the line and grab from our heated pickup lockers."}
                </p>
              </div>

              <label className="lg:col-span-2">
                <span className="block text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300">
                  Notes for the kitchen
                </span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="No olives, extra char please."
                  className="mt-2 h-28 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-red-400/70 focus:outline-none focus:ring-2 focus:ring-red-400/30"
                />
              </label>
            </div>

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300">
                  Your Details
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm text-zinc-300">
                    Name
                    <input
                      required
                      value={customer.name}
                      onChange={(event) =>
                        setCustomer((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Ada Lovelace"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-red-400/70 focus:outline-none focus:ring-2 focus:ring-red-400/30"
                    />
                  </label>
                  <label className="text-sm text-zinc-300">
                    Phone
                    <input
                      required
                      value={customer.phone}
                      onChange={(event) =>
                        setCustomer((prev) => ({
                          ...prev,
                          phone: event.target.value,
                        }))
                      }
                      placeholder="(555) 010-1992"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-red-400/70 focus:outline-none focus:ring-2 focus:ring-red-400/30"
                    />
                  </label>
                </div>
                <label className="text-sm text-zinc-300">
                  {service === "delivery" ? "Delivery Address" : "Email for pickup receipt"}
                  <input
                    required
                    value={customer.address}
                    onChange={(event) =>
                      setCustomer((prev) => ({
                        ...prev,
                        address: event.target.value,
                      }))
                    }
                    placeholder={
                      service === "delivery"
                        ? "221B Baker Street, Apt 5"
                        : "ada@lovelace.studio"
                    }
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-sky-400/70 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                    type={service === "delivery" ? "text" : "email"}
                  />
                </label>
              </div>
              <aside className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300">
                    Order Summary
                  </h3>
                  <SummaryLine label="Size" value={sizes.find((s) => s.id === size)?.label ?? ""} />
                  <SummaryLine
                    label="Crust"
                    value={crusts.find((c) => c.id === crust)?.label ?? ""}
                  />
                  <SummaryLine
                    label="Sauce"
                    value={sauces.find((s) => s.id === sauce)?.label ?? ""}
                  />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                      Toppings
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-zinc-200">
                      {selectedToppings.size ? (
                        Array.from(selectedToppings).map((id) => (
                          <li key={id}>
                            {toppings.find((t) => t.id === id)?.label}
                          </li>
                        ))
                      ) : (
                        <li>No extra toppings</li>
                      )}
                    </ul>
                  </div>
                  {extraSelections.size ? (
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                        Extras
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-zinc-200">
                        {Array.from(extraSelections).map((id) => (
                          <li key={id}>
                            {extras.find((extra) => extra.id === id)?.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
                <div className="mt-6 space-y-3 border-t border-white/10 pt-4">
                  <SummaryLine
                    label={service === "delivery" ? "Delivery Courier" : "Pickup"}
                    value={
                      service === "delivery" ? formatCurrency(3.75) : "Ready at bar"
                    }
                  />
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/60 px-4 py-3">
                    <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                      Total Due
                    </span>
                    <span className="text-2xl font-semibold text-white">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </aside>
            </section>

            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/10 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3 text-sm text-zinc-200">
                <Check className="size-4 text-emerald-300" />
                Orders are staged in our smart ovens minutes before dispatch.
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-red-900/40 transition hover:bg-red-400 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 disabled:bg-red-500/50"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Firing Oven
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </form>
        </div>

        <aside className="flex w-full max-w-sm shrink-0 flex-col gap-6">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/40">
            <h2 className="text-lg font-semibold tracking-tight text-white">
              Chef Signature Loads
            </h2>
            <p className="mt-2 text-sm text-zinc-300">
              Tap to load a pre-designed combination. Modify anything after it
              loads—your total updates instantly.
            </p>
            <div className="mt-4 space-y-3">
              <ChefPreset
                title="Vesuvian Ember"
                description="Large hand-tossed with marinara, buffalo mozz, pepperoni, charred broccolini, truffle honey."
                onApply={() => {
                  setSize("large");
                  setCrust("hand_tossed");
                  setSauce("marinara");
                  setSelectedToppings(
                    new Set<(typeof toppings)[number]["id"]>([
                      "buffalo_mozz",
                      "pepperoni",
                      "charred_broccolini",
                      "truffle_honey",
                    ]),
                  );
                  setExtraSelections(
                    new Set<(typeof extras)[number]["id"]>(["garlic_knots"]),
                  );
                  setService("delivery");
                }}
              />
              <ChefPreset
                title="Green Market"
                description="Regular gluten-friendly crust, pesto, heirloom tomatoes, mushrooms, broccolini."
                onApply={() => {
                  setSize("regular");
                  setCrust("gluten_free");
                  setSauce("pesto");
                  setSelectedToppings(
                    new Set<(typeof toppings)[number]["id"]>([
                      "smoked_prov",
                      "roasted_mushrooms",
                      "heirloom_tomatoes",
                      "charred_broccolini",
                    ]),
                  );
                  setExtraSelections(
                    new Set<(typeof extras)[number]["id"]>([
                      "blood_orange_soda",
                    ]),
                  );
                  setService("pickup");
                }}
              />
              <ChefPreset
                title="Sweet Heat"
                description="Party pie, thin crust with Detroit sauce, calabrese, pickled jalapeños, roasted pineapple."
                onApply={() => {
                  setSize("party");
                  setCrust("thin");
                  setSauce("detroit");
                  setSelectedToppings(
                    new Set<(typeof toppings)[number]["id"]>([
                      "calabrese",
                      "pickled_jalapenos",
                      "pineapple",
                      "smoked_prov",
                    ]),
                  );
                  setExtraSelections(
                    new Set<(typeof extras)[number]["id"]>(["tiramisu"]),
                  );
                  setService("delivery");
                }}
              />
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold tracking-tight text-white">
              Experience Upgrades
            </h2>
            <div className="space-y-3">
              {experiences.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-200"
                >
                  <span className="mt-1 rounded-full bg-white/10 p-2 text-red-200">
                    {item.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-zinc-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-emerald-400/40 bg-emerald-500/10 p-6 text-emerald-50 shadow-lg shadow-emerald-900/30">
            <h2 className="text-lg font-semibold tracking-tight text-white">
              Order Status
            </h2>
            {confirmation ? (
              <div className="mt-3 space-y-2 text-sm">
                <p className="flex items-center gap-2 text-emerald-100">
                  <Check className="size-4" />
                  Your pizza is queued in the oven.
                </p>
                <p>
                  <span className="font-semibold">ETA:</span> {confirmation.eta}
                </p>
                <p>
                  <span className="font-semibold">Ref:</span>{" "}
                  {confirmation.reference}
                </p>
              </div>
            ) : isPending ? (
              <div className="mt-3 flex items-center gap-3 text-sm text-emerald-100">
                <Loader2 className="size-4 animate-spin" />
                Prepping your dough, steaming basil...
              </div>
            ) : (
              <p className="mt-3 text-sm text-emerald-100">
                Place an order to see real-time status updates here.
              </p>
            )}
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-200">
            <h2 className="text-lg font-semibold tracking-tight text-white">
              Recent Agentic Orders
            </h2>
            <RecentOrders version={historyVersion} />
          </section>
        </aside>
      </main>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm text-zinc-200">
      <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">
        {label}
      </span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

function ChefPreset({
  title,
  description,
  onApply,
}: {
  title: string;
  description: string;
  onApply: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onApply}
      className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-left text-sm text-zinc-200 transition hover:border-red-300/70 hover:bg-red-500/10"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-white">{title}</p>
        <span className="rounded-full border border-red-300/30 bg-red-400/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-red-100">
          Load
        </span>
      </div>
      <p className="mt-2 text-xs text-zinc-300">{description}</p>
    </button>
  );
}

function RecentOrders({ version }: { version: number }) {
  const orders = useMemo(() => {
    void version;
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(
        window.localStorage.getItem("agentic-orders") ?? "[]",
      ) as {
        reference: string;
        size: string;
        service: string;
        total: number;
        time: string;
      }[];
    } catch (error) {
      console.warn("Failed to read stored orders", error);
      return [];
    }
  }, [version]);

  if (!orders.length) {
    return (
      <p className="mt-2 text-sm text-zinc-400">
        Your last five creations will surface here after you place an order.
      </p>
    );
  }

  return (
    <ul className="mt-3 space-y-3">
      {orders.map((order) => (
        <li
          key={order.reference}
          className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/40 px-4 py-3"
        >
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-zinc-400">
            <span>{order.reference}</span>
            <span>{new Date(order.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-zinc-200">
            <span>{order.size}</span>
            <span>{order.service}</span>
            <span className="font-semibold text-white">
              {formatCurrency(order.total)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
