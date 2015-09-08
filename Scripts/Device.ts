module DTO
{
	export class Device
	{
		public id: string;
		public imei: string;
		public name: string;
		public owner: string;
		public device_type: string;
	}

	export class Coordinates
	{
		public id: string;
		public packet_time: string;
        public device_id: number;
		public lon: number;
		public lat: number;
        public rad: number;
        public packet_type: string;
        public speed: number;
        public direction: number;
        public blackbox: number;
	}
}