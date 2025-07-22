<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->_id,
        'title' => $this->title,
        'description' => $this->description,
        'category' => $this->category,
        'capacity' => $this->capacity,
        'enrolled_students' => $this->enrolled_students,
        'is_full' => $this->isFull(), 
        'available_slots' => $this->capacity - $this->enrolled_students, 
        'instructor' => new InstructorResource($this->whenLoaded('instructor')),
        'created_at' => $this->created_at->toDateTimeString(),
            
        ];
    }
}
