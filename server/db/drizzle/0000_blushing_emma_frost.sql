CREATE TABLE `votingData` (
	`id` text PRIMARY KEY NOT NULL,
	`voteType` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `votingData_id_unique` ON `votingData` (`id`);