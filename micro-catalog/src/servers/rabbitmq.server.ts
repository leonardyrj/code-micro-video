import {
    Application,
    ApplicationConfig,
    Binding,
    Context,
    CoreBindings,
    inject, MetadataInspector,
    Server,
    ValueOrPromise
} from "@loopback/core";
import {Channel, ConfirmChannel, Connection, Options, Replies} from 'amqplib';
import AssertQueue = Replies.AssertQueue;
import AssertExchange =Replies.AssertExchange;
import {repository} from "@loopback/repository";
import {CategoryRepository} from "../repositories";
import {Category} from "../models";
import {RabbitmqBindings} from "../keys";
import {AmqpConnectionManager, AmqpConnectionManagerOptions, ChannelWrapper, connect} from "amqp-connection-manager";

export interface RabbitmqConfig{
    uri: string;
    connOptions?: AmqpConnectionManagerOptions;
    exchanges?: {
        name: string;
        type: string;
        options?: Options.AssertExchange
    }[]
}

export class RabbitmqServer extends Context implements Server{
    private _listening: boolean;
    private channel: ChannelWrapper;
    private _conn: AmqpConnectionManager
    private _channelManager: ChannelWrapper;

    constructor(
        @inject(CoreBindings.APPLICATION_INSTANCE) public app: Application,
        @repository(CategoryRepository) private categoryRepo: CategoryRepository,
        @inject(RabbitmqBindings.CONFIG) private config: RabbitmqConfig
    ) {
        super(app);
    }

    init(...injectedArgs: unknown[]): ValueOrPromise<void> {
        return undefined;
    }

    async start(...injectedArgs: unknown[]): Promise<void> {
        this._conn = connect([this.config.uri],this.config.connOptions)
        this._channelManager = this.conn.createChannel();
        this._channelManager.on('connect', () =>{
            this._listening = true;
            console.log("Connectou ao servidor do RabbitMQ");
        })
        this._channelManager.on('error', (error, {name}) =>{
            this._listening = false;
            console.log(`Error: ${error}, ${name}`);
        })
        await this.setupExchange();


        //this.boot();
    }

    // private getSubsccribers(){
    //     const bindings: Array<Readonly<Binding>> = this.find('services.*');
    //     return bindings.map(
    //         bindings => {
    //             const metadata = MetadataInspector.getAllMethodMetadata(
    //                 RABB
    //             )
    //         }
    //     )
    // }

    private async setupExchange(){
        return this.channelManager.addSetup(async (channel: ConfirmChannel) =>{
            console.log(this.config)
            if(!this.config.exchanges){
                return;
            }
            await Promise.all(this.config.exchanges.map((exchange) => (
                channel.assertExchange(exchange.name, exchange.type, exchange.options)
            )))
        })
    }

    // async boot(){
    //     this.channel = this._conn.createChannel();
    //     const queue: AssertQueue = await this.channel.assertQueue('micro-catalog/sync-videos');
    //     const exchange: AssertExchange = await this.channel.assertExchange('amq.topic','topic');
    //
    //     await this.channel.bindQueue(queue.queue, exchange.exchange, 'model.*.*');
    //
    //     this.channel.consume(queue.queue, (message) => {
    //         if (!message) {
    //             return;
    //         }
    //
    //         const data = JSON.parse(message.content.toString());
    //         const [model, event] = message.fields.routingKey.split('.').slice(1);
    //         this.sync({model, event, data}).then(() => {
    //             this.channel.ack(message)
    //         }).catch((error) =>{
    //             console.log(error)
    //             this.channel.reject(message,false)
    //         }
    //
    //         )
    //     })
    // }

    async sync({model, event, data} : {model: string, event: string, data: Category}){
        if(model === 'category'){
            switch (event){
                case 'created':
                    await this.categoryRepo.create({
                        ...data,
                        created_at: new Date().toString(),
                        updated_at: new Date().toString()
                    })
                    break;
                case 'updated':
                    await this.categoryRepo.updateById(data.id, data)
                    break;
                case 'deleted':
                    await this.categoryRepo.deleteById(data.id);
                    break;
            }
        }
    }

    async stop(...injectedArgs: unknown[]): Promise<void> {
        await this._conn.close();
        this._listening = false;
    }

    get listening(): boolean{
        return this._listening;
    }

    get conn(): AmqpConnectionManager{
        return this._conn;
    }

    get channelManager(): ChannelWrapper{
        return this._channelManager;
    }



}