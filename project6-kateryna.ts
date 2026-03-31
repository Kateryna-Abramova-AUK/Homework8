//model of the virtual DOM node
export type VNode = {
  type: string;
  props: Record<string, any>;
  children: Array<VNode | string>;
};

export type Patch = { 
  type: "replace" | "update-props" | "remove" | "insert"; 
  path: number[]; 
  node?: VNode | string; 
  props?: Record<string, any> 
};

export function diff(oldNode: any, newNode: any, path: number[] = []): Patch[] {
  const patches: Patch[] = [];

  if (!newNode) return [{ type: "remove", path }]; // If the new node doesn't exist, means we need to remove the old node

  if (!oldNode) return [{ type: "insert", path, node: newNode }]; //If the old node didn't exist, it's brand new

  // here we are checking if the type of the node has changed or if the node itself is of a different type
  // If true, the old node should be replaced with the new node
  if (oldNode.type !== newNode.type || typeof oldNode !== typeof newNode) {
    return [{ type: "replace", path, node: newNode }];
  }

  //If they are the same type, check if the properties changed
  const propChanges: Record<string, any> = {};
  let hasChanged = false;

  for (const key in newNode.props) {
    if (oldNode.props[key] !== newNode.props[key]) { 
      propChanges[key] = newNode.props[key]; // Mark the change
      hasChanged = true;
    }
  }
  for (const key in oldNode.props) {
    if (!(key in newNode.props)) {
      propChanges[key] = undefined; // Mark for removal
      hasChanged = true;
    }
  }
    if (hasChanged) {
    patches.push({ type: "update-props", path, props: propChanges });
  }

  //compare the children of the old and new nodes and generate patches for any differences
  const maxChildren = Math.max(oldNode.children?.length || 0, newNode.children?.length || 0);
  for (let i = 0; i < maxChildren; i++) {
    //here we are recursively calling diff for each child node, 
    //we can keep track of where in the tree we are when generating patches
    const childPatches = diff(oldNode.children?.[i], newNode.children?.[i], [...path, i]);
    patches.push(...childPatches); //concatenating prev array with the patches generated for the child nodes
  }

  return patches;
}