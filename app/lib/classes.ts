export class Duration {
    /** DB returns duration as int, represents tenths of seconds.
     * For example, 600 is actually 60.0 seconds.
     */
    static fromDB(dbValue: number): number {
        return dbValue / 10
    }

    static toDB(value: number | null): number | null {
        if (value != null) {
            return Math.trunc(value * 10)
        }
        return null
    }
}