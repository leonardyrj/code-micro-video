<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;


abstract class BaseCrudController extends Controller
{
    protected $paginationSize = 15;

    protected abstract function model();

    protected abstract function rulesStore();

    protected abstract function rulesUpdate();

    protected abstract function resouce();

    protected abstract function resouceCollection();

    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page',$this->paginationSize);
        $hasFilter = in_array(Filterable::class,class_uses($this->model()));
        $query = $this->queryBuilder();

        if($hasFilter){
            $query = $query->filter($request->all());
        }

        $data = $request->has('all') || !$this->paginationSize
            ? $query->get()
            : $query->paginate($perPage);

        $resourceCollectionClass = $this->resouceCollection();
        $refClass = new \ReflectionClass($this->resouceCollection());
        return $refClass->isSubclassOf(ResourceCollection::class)
            ? new $resourceCollectionClass($data)
            : $resourceCollectionClass::collection($data);
    }


    public function store(Request $request)
    {
        $validatedData = $this->validate($request,$this->rulesStore());
        $obj = $this->model()::create($validatedData);
        $obj->refresh();
        $resource = $this->resouce();
        return new $resource($obj);
    }

    public function show($id)
    {
        $obj = $this->findOrFail($id);
        $resource = $this->resouce();
        return new $resource($obj);
    }

    public function update(Request $request, $id)
    {
        $obj = $this->findOrFail($id);
        $validatedData = $this->validate($request, $this->rulesUpdate());
        $obj->update($validatedData);
        $resource = $this->resouce();
        return new $resource($obj);
    }

    public function destroy($id)
    {
        $obj = $this->findOrFail($id);
        $obj->delete();
        return response()->noContent();
    }

    public function destroyCollection(Request $request)
    {
        $data = $this->validateIds($request);
        $this->model()::whereIn('id', $data['ids'])->delete();
        return response()->noContent();
    }

    protected function validateIds(Request $request)
    {
        $model = $this->model();
        $ids = explode(',',$request->get('ids'));
        $validator = \Validator::make(
            [
                'ids' => $ids
            ],
            [
                'ids' => 'required|exists:' . (new $model)->getTable() . ',id'
            ]
        );
        return $validator->validate();
    }

    protected function findOrFail($id)
    {
        $model = $this->model();
        $keyName = (new $model)->getRouteKeyName();
        return $this->model()::where($keyName,$id)->firstOrFail();
    }

    protected function queryBuilder(): Builder {
        return $this->model()::query();
    }






}
