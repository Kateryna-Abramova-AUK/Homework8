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

  // 1. If the new node doesn't exist, it was deleted
  if (!newNode) return [{ type: "remove", path }];

  // 2. If the old node didn't exist, it's brand new
  if (!oldNode) return [{ type: "insert", path, node: newNode }];

  // 3. If they are different types (e.g., 'div' vs 'span'), replace everything
  if (oldNode.type !== newNode.type || typeof oldNode !== typeof newNode) {
    return [{ type: "replace", path, node: newNode }];
  }

  // 4. If they are the same type, check if the properties (like 'class') changed
  const propChanges: Record<string, any> = {};
  let hasChanged = false;

  for (const key in newNode.props) {
    if (oldNode.props[key] !== newNode.props[key]) {
      propChanges[key] = newNode.props[key];
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

  // 5. Look at the children and repeat this process for each one (Recursion)
  const maxChildren = Math.max(oldNode.children?.length || 0, newNode.children?.length || 0);
  for (let i = 0; i < maxChildren; i++) {
    const childPatches = diff(oldNode.children?.[i], newNode.children?.[i], [...path, i]);
    patches.push(...childPatches);
  }

  return patches;
}