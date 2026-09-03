"use client";

export interface AddressData {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  pincode: string;
}

interface AddressFormProps {
  value: AddressData;
  onChange: (value: AddressData) => void;
}

// Pure controlled form -- parent owns the state (checkout page), this
// just renders inputs and reports changes up. No validation logic here
// beyond `required` -- add real validation (pincode format, phone
// format) if you want it, that's a reasonable thing for you to own.
export default function AddressForm({ value, onChange }: AddressFormProps) {
  function set<K extends keyof AddressData>(key: K, v: AddressData[K]) {
    onChange({ ...value, [key]: v });
  }

  const inputClass = "w-full border px-3 py-2 text-sm";
  const inputStyle = {
    borderColor: "var(--color-line)",
    borderRadius: "var(--radius-card)",
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        required
        placeholder="Full name"
        value={value.name}
        onChange={(e) => set("name", e.target.value)}
        className={inputClass}
        style={inputStyle}
      />
      <input
        required
        type="tel"
        placeholder="Phone number"
        value={value.phone}
        onChange={(e) => set("phone", e.target.value)}
        className={inputClass}
        style={inputStyle}
      />
      <input
        required
        placeholder="Address"
        value={value.addressLine}
        onChange={(e) => set("addressLine", e.target.value)}
        className={inputClass}
        style={inputStyle}
      />
      <div className="flex gap-3">
        <input
          required
          placeholder="City"
          value={value.city}
          onChange={(e) => set("city", e.target.value)}
          className={inputClass}
          style={inputStyle}
        />
        <input
          required
          placeholder="Pincode"
          value={value.pincode}
          onChange={(e) => set("pincode", e.target.value)}
          className={inputClass}
          style={inputStyle}
        />
      </div>
    </div>
  );
}
