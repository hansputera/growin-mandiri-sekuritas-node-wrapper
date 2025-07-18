export abstract class StoreBase<T> {
	public abstract get<K extends keyof T>(key: K): Promise<T[K]>;
	public abstract set<K extends keyof T>(key: K, value: T[K]): Promise<void>;
	public abstract setState(value: T): Promise<void>;
	public abstract delete(key: keyof T): Promise<void>;
}
