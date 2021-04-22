import {Context, Server, ValueOrPromise} from "@loopback/core";
import {connect, Connection} from 'amqplib';

export class RabbitmqServer extends Context implements Server{
    private _listening: boolean;
    conn: Connection;

    init(...injectedArgs: unknown[]): ValueOrPromise<void> {
        return undefined;
    }

    async start(...injectedArgs: unknown[]): Promise<void> {
        this.conn = await connect({
            hostname: 'rabbitmq',
            username: 'admin',
            password: 'admin'
        })
        this._listening = true;
    }

    async stop(...injectedArgs: unknown[]): Promise<void> {
        await this.conn.close();
        this._listening = false;
    }

    get listening(): boolean{
        return this._listening;
    }



}