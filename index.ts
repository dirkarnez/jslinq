interface Order {
    id: number
    amount: number
    country: string
}

class EnhancedArray<T> extends Array<T>{
    protected parent?: EnhancedArray<T>;
    private sql: string;

    constructor(...items: T[]) {
        super(...items);
        this.sql = "";
        this.parent = undefined;
    }

    GREATER_THAN(key: keyof T, targetValue: any): EnhancedArray<T> {
        const filtered =  this.filter(value => value[key] > targetValue);
        const retValue = new EnhancedArray<T>(...filtered);
        retValue.parent = this;

        if (!this.parent) {
            this.sql = `select * from Orders where ${key} > ${targetValue}`;
        } else {
            this.sql = `and ${key} > ${targetValue}`;
        }

        return retValue;
    }

    EQUAL(key: keyof T, targetValue: any): EnhancedArray<T> {
        const filtered =  this.filter(value => value[key] > targetValue);
        const retValue = new EnhancedArray<T>(...filtered);
        retValue.parent = this;
        if (!this.parent) {
            this.sql = `select * from Orders where ${key} = ${targetValue}`;
        } else {
            this.sql = `and ${key} = ${targetValue}`;
        }

        return retValue;
    }

    // singleOrDefault = callback => {
    //     var foundFirst = this.findIndex(callback);
    //     if (foundFirst > -1) {
    //     var foundSecond = 
    //     this
    //     .slice(foundFirst + 1)
    //     .findIndex(callback);
        
    //     return foundSecond > -1 ? undefined : this[foundFirst];
    //     }
    //     return undefined;
    // }

    toSQL(): string {
        if (!!this.parent) {
            const parentSQL = this.parent.toSQL();
            const thisSQL = !!this.sql && this.sql.length > 0 ? " " + this.sql : "";
            return this.parent.toSQL() + thisSQL;
        }
        return this.sql;
    }
}

const orders = new EnhancedArray<Order>();
orders.push( { id: 0, amount: 140, country: "USA"});
orders.push( { id: 0, amount: 120, country: "AUS"});
orders.push( { id: 0, amount: 50, country: "JPN"});


console.log(
    orders
    .GREATER_THAN("amount", 100)
    .GREATER_THAN("amount", 100)
    .EQUAL("country", "AUS")
    .EQUAL("country", "JPN")
    .toSQL()
);
// "select * from Orders where amount > 100 and amount > 100 and country = AUS and country = JPN"
