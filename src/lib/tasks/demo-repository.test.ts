import { describe, expect, it } from "vitest";
import { groupByDueDate } from "@/core/due-groups";
import { buildSampleTasks } from "@/mocks/tasks";
import { decodeDemoTasks, DEMO_COOKIE_MAX_LENGTH, DEMO_MAX_TASKS, encodeDemoTasks } from "./demo-cookie";
import { createDemoRepository, DemoFullError, type DemoCookieJar } from "./demo-repository";

const TODAY = "2026-11-23";

/** A fake cookie for one browser: each visitor gets their own jar. */
function fakeJar(): DemoCookieJar & { value?: string } {
  const jar: DemoCookieJar & { value?: string } = {
    async read() {
      return jar.value;
    },
    async write(value) {
      jar.value = value;
    },
  };
  return jar;
}

const newTask = { title: "Acheter du pain", description: "Une baguette", dueDate: "2026-11-24", source: "manual" as const };

describe("buildSampleTasks", () => {
  it("fills every due group around the visit day", () => {
    const groups = groupByDueDate(buildSampleTasks(TODAY), TODAY);
    expect(groups.overdue).not.toHaveLength(0);
    expect(groups.today).not.toHaveLength(0);
    expect(groups.next7Days).not.toHaveLength(0);
    expect(groups.later).not.toHaveLength(0);
    expect(groups.done).not.toHaveLength(0);
  });
});

describe("demo cookie", () => {
  it("reads back what it wrote", () => {
    const file = { schemaVersion: 1, tasks: buildSampleTasks(TODAY) };
    expect(decodeDemoTasks(encodeDemoTasks(file))).toEqual(file);
  });

  it("ignores a missing or damaged cookie", () => {
    expect(decodeDemoTasks(undefined)).toBeNull();
    expect(decodeDemoTasks("not-a-demo-cookie")).toBeNull();
  });

  it("keeps the sample list well under the cookie size limit", () => {
    const value = encodeDemoTasks({ schemaVersion: 1, tasks: buildSampleTasks(TODAY) });
    expect(value.length).toBeLessThan(DEMO_COOKIE_MAX_LENGTH / 2);
  });
});

describe("createDemoRepository", () => {
  it("shows the sample list to a new visitor", async () => {
    const repository = createDemoRepository(fakeJar(), () => TODAY);
    expect(await repository.list()).toEqual(buildSampleTasks(TODAY));
  });

  it("keeps each visitor's changes in their own browser", async () => {
    const alice = createDemoRepository(fakeJar(), () => TODAY);
    const bob = createDemoRepository(fakeJar(), () => TODAY);
    await alice.update("t1", { status: "done" });
    await alice.add(newTask);

    const aliceTasks = await alice.list();
    expect(aliceTasks.find((task) => task.id === "t1")?.status).toBe("done");
    expect(aliceTasks.some((task) => task.title === "Acheter du pain")).toBe(true);
    expect(await bob.list()).toEqual(buildSampleTasks(TODAY));
  });

  it("starts over from the sample list once the cookie is gone", async () => {
    const jar = fakeJar();
    const repository = createDemoRepository(jar, () => TODAY);
    await repository.add(newTask);
    jar.value = undefined; // what "Réinitialiser" does
    expect(await repository.list()).toEqual(buildSampleTasks(TODAY));
  });

  it(`refuses a new task once the demo holds ${DEMO_MAX_TASKS} tasks`, async () => {
    const repository = createDemoRepository(fakeJar(), () => TODAY);
    while ((await repository.list()).length < DEMO_MAX_TASKS) await repository.add(newTask);
    await expect(repository.add(newTask)).rejects.toBeInstanceOf(DemoFullError);
  });

  it("refuses a change that would not fit in the cookie", async () => {
    const jar = fakeJar();
    const repository = createDemoRepository(jar, () => TODAY);
    const random = Array.from({ length: 6000 }, () => String.fromCharCode(33 + Math.floor(Math.random() * 90))).join("");
    await expect(repository.update("t1", { description: random })).rejects.toBeInstanceOf(DemoFullError);
    expect(jar.value).toBeUndefined(); // nothing was written
  });
});
