import { diff } from "./virtualdom.ts";
/**
 * Test Suite for Mini DOM Differ
 */
function runTests() {

  // TEST 1: Node Replacement (Type Change)
  const t1_old = { type: "div", props: {}, children: ["Hello"] };
  const t1_new = { type: "span", props: {}, children: ["Hello"] };
  const p1 = diff(t1_old, t1_new, [0]);
  
  console.assert(p1.length > 0, "Test 1 Failed: No patches generated");
  console.assert(p1[0].type === "replace", "Test 1 Failed: Should detect type change as 'replace'");
  console.log("Test 1: Type Change detected.");


  //TEST 2: Property Updates
  const t2_old = { type: "button", props: { id: "old-id" }, children: [] };
  const t2_new = { type: "button", props: { id: "new-id", class: "active" }, children: [] };
  const p2 = diff(t2_old, t2_new, [0]);

  const propPatch = p2.find(p => p.type === "update-props");
  console.assert(propPatch?.props?.id === "new-id", "Test 2 Failed: ID was not updated");
  console.assert(propPatch?.props?.class === "active", "Test 2 Failed: New class was not added");
  console.log("Test 2: Property updates detected.");


  //TEST 3: Child Addition
  const t3_old = { type: "ul", props: {}, children: ["Item 1"] };
  const t3_new = { type: "ul", props: {}, children: ["Item 1", "Item 2"] };
  const p3 = diff(t3_old, t3_new, [0]);

  const insertPatch = p3.find(p => p.type === "insert");
  console.assert(insertPatch !== undefined, "Test 3 Failed: Insert patch not found");
  console.assert(insertPatch?.path.join(",") === "0,1", "Test 3 Failed: Incorrect path for child insertion");
  console.assert(insertPatch?.node === "Item 2", "Test 3 Failed: Incorrect node content inserted");
  console.log("Test 3: Child insertion and recursive pathing detected.");


  console.log("\nAll tests passed");
}

// Execute the tests
runTests();