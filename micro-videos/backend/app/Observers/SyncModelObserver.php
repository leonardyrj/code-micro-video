<?php

namespace App\Observers;
use Bschmitt\Amqp\Message;
use Illuminate\Database\Eloquent\Model;


class SyncModelObserver
{

    public function created(Model $model)
    {
        $modelName = $this->getModelName($model);
        $data = $model->toArray();
        $action = __FUNCTION__;
        $routingKey = "model.{$modelName}.{$action}";
        try{
            $this->publish($routingKey,$data);
        }catch (\Exception $exception){
            $this->reportException([
                'modelName' => $modelName,
                'id' => $model->id,
                'action' => $action,
                'exception' => $exception
            ]);
        }

    }

    public function updated(Model $model)
    {
        $modelName = $this->getModelName($model);
        $data = $model->toArray();
        $action = __FUNCTION__;
        $routingKey = "model.{$modelName}.{$action}";
        try{
            $this->publish($routingKey,$data);
        }catch (\Exception $exception){
            $this->reportException([
                'modelName' => $modelName,
                'id' => $model->id,
                'action' => $action,
                'exception' => $exception
            ]);
        }
    }


    public function deleted(Model $model)
    {
        $modelName = $this->getModelName($model);
        $data = ['id' => $model->id];
        $action = __FUNCTION__;
        $routingKey = "model.{$modelName}.{$action}";
        try{
            $this->publish($routingKey,$data);
        }catch (\Exception $exception){
            $this->reportException([
                'modelName' => $modelName,
                'id' => $model->id,
                'action' => $action,
                'exception' => $exception
            ]);
        }
    }

    /**
     * Pegando o nome do model
     * @param Model $model
     * @return string
     */
    protected function getModelName(Model $model){
        $shortName = (new \ReflectionClass($model))->getShortName();
        return \Illuminate\Support\Str::snake($shortName);
    }

    protected function publish($routingKey, array $data){
        $message = new Message(
            json_encode($data),
            [
                'content_type' => 'application/json',
                'delivery_mode' => 2
            ]
        );
        \Amqp::ṕublish(
            $routingKey,
            $message,
            [
                'exchange_type' => 'topic',
                'exchange' => 'amq.topic'
            ]
        );
    }

    protected function reportException(array $params){
        list(
            'modelName' => $modelName,
            'id' => $id,
            'action' => $action,
            'exception' => $exception
            ) = $params;
        $myException = new \Exception("The model $modelName witj ID $id deu merda on $action",0,$exception);
        report($myException);

    }
}
