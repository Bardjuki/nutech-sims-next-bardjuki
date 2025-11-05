// ====== Regex constants ======
export const numberRegex = /^\d+$/;
export const alphaRegex = /^[a-zA-Z]+$/;
export const alphaSpaceRegex = /^[a-zA-Z ]+$/;
export const alphaNumRegex = /^[a-zA-Z0-9]+$/;
export const alphaNumSpaceRegex = /^[a-zA-Z0-9 ]+$/;
export const emailRegex = /^[\w.!#$%&'*+/=?^_`{|}~@-]+$/;
export const fullEmailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
export const addressRegex = /^[a-zA-Z0-9.\-\/+,=_:'@% ]+$/;
export const pathRegex = /^\/(?:[a-zA-Z0-9-_]+\/)*[a-zA-Z0-9-_]*$/;
export const urlRegex =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)?(\?[^\s]*)?$/;
export const htmlTagRegex =
  /<([a-z]+)[\s\S]*?>[\s\S]*?<\/\1>|<([a-z]+)[\s\S]*?\/>/i;
export const slugPathRegex = /^@[A-Za-z0-9_-]+$/;
export const slugQueryRegex = /^[A-Za-z0-9_-]+$/;

// ====== Utility types ======
type Path = (string | number)[];
type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

// A type that covers both arrays and objects with flexible index signatures
// A type that covers both arrays and objects with flexible index signatures
type Indexable = Record<string | number, unknown> | unknown[]; // Accept both objects and arrays

// ====== Safe access helper ======
function getKeyedValue(obj: Indexable, key: string | number): unknown {
  return (obj as Record<string | number, unknown>)[String(key)];
}

function setKeyedValue(
  obj: Indexable,
  key: string | number,
  value: unknown
): void {
  (obj as Record<string | number, unknown>)[String(key)] = value;
}

// ====== Dynamic Getter ======
export function dynamicGetter<T extends Indexable, R = unknown>(
  state: T,
  path: Path
): R | undefined {
  return path.reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return getKeyedValue(acc as Indexable, key);
    }
    return undefined;
  }, state) as R | undefined;
}

// ====== Dynamic Setter ======
export function dynamicSetter<T>(
  setState: StateSetter<T>,
  path: Path,
  value: string,
  isLowerCase = false,
  regex?: RegExp
): void {
  if (regex && !regex.test(value) && value !== "" && value !== undefined)
    return;

  if (path?.length > 0) {
    setState((prev) => {
      // Refine the type of newState as Indexable
      const newState: Indexable = Array.isArray(prev)
        ? [...(prev as unknown[])] // Copy the array, type assertion here
        : { ...(prev as Record<string | number, unknown>) }; // Copy the object, type assertion here

      let current: Indexable = newState;

      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        const existing = getKeyedValue(current, key);
        if (!existing || typeof existing !== "object") {
          setKeyedValue(current, key, {});
        }
        current = getKeyedValue(current, key) as Indexable;
      }

      const lastKey = path[path.length - 1];
      setKeyedValue(
        current,
        lastKey,
        isLowerCase ? value.toLowerCase() : value
      );

      return newState as T;
    });
  } else {
    setState(isLowerCase ? (value.toLowerCase() as T) : (value as T));
  }
}

// ====== Dynamic Assign ======
export function dynamicAssign<T>(
  reference: T,
  path: Path,
  value: string,
  isLowerCase = false,
  regex?: RegExp
): T {
  if (regex && !regex.test(value) && value !== "" && value !== undefined)
    return reference;

  const newRef: Indexable = Array.isArray(reference)
    ? [...(reference as unknown[])]
    : { ...(reference as Record<string | number, unknown>) };

  if (path?.length > 0) {
    let current: Indexable = newRef;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      const existing = getKeyedValue(current, key);
      if (!existing || typeof existing !== "object") {
        setKeyedValue(current, key, {});
      }
      current = getKeyedValue(current, key) as Indexable;
    }

    const lastKey = path[path.length - 1];
    setKeyedValue(current, lastKey, isLowerCase ? value.toLowerCase() : value);
  } else {
    return isLowerCase
      ? (value.toLowerCase() as unknown as T)
      : (value as unknown as T);
  }

  return newRef as T;
}

// ====== Order By Id Array ======
interface IdObject {
  id: string | number;
}

export function orderByIdArray<T extends IdObject>(
  idArray: (string | number)[],
  objectArray: T[]
): T[] {
  return objectArray
    .filter((obj) => idArray.includes(obj.id))
    .sort((a, b) => idArray.indexOf(a.id) - idArray.indexOf(b.id));
}
