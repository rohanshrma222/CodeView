-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER,
    "status" TEXT NOT NULL,
    "streamCallId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "interviewerIds" TEXT[],

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "interviewerId" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Interview_streamCallId_key" ON "Interview"("streamCallId");

-- CreateIndex
CREATE INDEX "by_candidate_id" ON "Interview"("candidateId");

-- CreateIndex
CREATE INDEX "by_stream_call_id" ON "Interview"("streamCallId");

-- CreateIndex
CREATE INDEX "by_interview_id" ON "Comment"("interviewId");

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
