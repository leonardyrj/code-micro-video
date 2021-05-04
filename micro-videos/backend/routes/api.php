<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
//
//Route::middleware('auth:api')->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::group(['namespace'=> 'Api', 'middleware' => [
    'auth:api',
    'can:catalog-admin'
]], function(){
    $exceptCreateAndEdit = [
        'except' => ['create','edit']
    ];

    Route::resource('categories', 'CategoryController', $exceptCreateAndEdit);
    Route::delete('categories', 'CategoryController@destroyCollection');
    Route::resource('genres', 'GenreController', $exceptCreateAndEdit);
    Route::delete('genres', 'GenreController@destroyCollection');
    Route::resource('cast-members', 'CastMemberController', $exceptCreateAndEdit);
    Route::delete('cast-members', 'CastMemberController@destroyCollection');
    Route::resource('videos', 'VideoController', $exceptCreateAndEdit);
    Route::delete('videos', 'VideoController@destroyCollection');

});

