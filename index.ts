import "reflect-metadata";
const formatMetadataKey = Symbol("format");

function Entity(tableName: string) { 
  return <T extends { new (...args: any[]): {} }>(constructor: T) => { 
    //constructor.prototype.lucky = Math.floor(Math.random() * Math.floor(limit)
    return class extends constructor {
        reportingURL = "http://www...";
    };
  }
}

function PrimaryGeneratedColumn(columnName: string) {
    const dbg = Reflect.metadata(formatMetadataKey, columnName);
    return dbg;
}

function getPrimaryGeneratedColumnName(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}


function Column(columnName: string) {
    const dbg = Reflect.metadata(formatMetadataKey, columnName);
    return dbg;
}

function getColumnName(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}


@Entity("Orders")
class Order {
    @PrimaryGeneratedColumn("id")
    id: number = NaN
    
    @Column("amount")
    amount: number = NaN
    
    @Column("country")
    country?: string
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
            this.sql = `and ${key} > ${typeof targetValue == typeof "" ? `'${targetValue}'` : targetValue}`;
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
            this.sql = `and ${key} = ${typeof targetValue == typeof "" ? `'${targetValue}'` : targetValue}`;
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
orders.push(...[
    { id: 0, amount: 140, country: "USA"},
    { id: 0, amount: 120, country: "AUS"},
    { id: 0, amount: 50, country: "JPN"}
]);

class User {
    public name?: string;

}

function DB<T>(c: { new(): T; }, data: Array<T>) {
    const proxy = new c();
    const keys = Object.keys(proxy);

    keys.forEach(key => {
        Object.defineProperty(proxy, key, {
            get: function() { alert(`${key} is getted`) },
        });
    })

    return {
        GREATER_THAN: (getter: (item: T) => T[keyof T], targetValue: any) => {
            const a = getter(proxy);
            const newdata = data.filter(item => getter(item) > targetValue)
            debugger;
        }
    }
}

DB(
    Order, 
    [
        { id: 0, amount: 140, country: "USA"},
        { id: 0, amount: 120, country: "AUS"},
        { id: 0, amount: 50, country: "JPN"}
    ]
)
.GREATER_THAN(order => order.amount, 100);

// console.log(
//     orders
//     .GREATER_THAN("amount", 100)
//     .GREATER_THAN("amount", 100)
//     .EQUAL("country", "AUS")
//     .EQUAL("country", "JPN")
//     .toSQL()
// );
// "select * from Orders where amount > 100 and amount > 100 and country = AUS and country = JPN"
