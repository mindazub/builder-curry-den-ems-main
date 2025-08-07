<?php
// app/Http/Controllers/Api/PlantController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plant;
use App\Services\PlantDataService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PlantController extends Controller
{
    public function __construct(
        private PlantDataService $plantDataService
    ) {}

    /**
     * GET /api/plants
     */
    public function index(): JsonResponse
    {
        $plants = Plant::where('user_id', auth()->id())
            ->select('id', 'uid', 'name', 'status', 'capacity', 'latitude', 'longitude', 'updated_at')
            ->get();

        return response()->json([
            'plants' => $plants->map(fn($plant) => [
                'plant_metadata' => [
                    'uid' => $plant->uid,
                    'owner' => auth()->user()->name,
                    'status' => $plant->status,
                    'capacity' => $plant->capacity,
                    'latitude' => $plant->latitude,
                    'longitude' => $plant->longitude,
                    'updated_at' => $plant->updated_at->timestamp,
                ]
            ])
        ]);
    }

    /**
     * GET /api/plants/{plant}?start={timestamp}&end={timestamp}
     */
    public function show(Plant $plant, Request $request): JsonResponse
    {
        $this->authorize('view', $plant);

        $request->validate([
            'start' => 'required|integer',
            'end' => 'required|integer',
        ]);

        $startTimestamp = $request->integer('start');
        $endTimestamp = $request->integer('end');

        $plantData = $this->plantDataService->getPlantData(
            $plant,
            $startTimestamp,
            $endTimestamp
        );

        return response()->json($plantData);
    }
}
