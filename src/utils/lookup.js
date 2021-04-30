export const componentLookup = (store, uuid) => {
  for (let i = 0; i < store.components.length; i++) {
    if (store.components[i].uuid == uuid) {
      return store.components[i];
    }
  }
  return false;
};

export const componentLookupAndPosition = (store, uuid) => {
  let component = componentLookup(store, uuid);
  if (!component) return false;

  for (let z = 0; z < store.boxes.length; z++) {
    let box = store.boxes[z];
    for (let i = 0; i < box.sections.length; i++) {
      for (let j = 0; j < box.sections[i].assignments.length; j++) {
        for (let b = 0; b < box.sections[i].assignments[j].length; b++) {
          if (box.sections[i].assignments[j][b] == component.uuid) {
            //check uuid match
            return {
              component: component,
              boxNum: z + 1,
              sectionNum: i + 1,
              sectionType: box.sections[i].type,
              sectionRow: j + 1,
              sectionCol: b + 1,
            };
          }
        }
      }
    }
  }

  return false;
};

export const getFreeSpaceInBox = (box) => {
  let s = 0;
  for (let i = 0; i < box.sections.length; i++) {
    for (let j = 0; j < box.sections[i].assignments.length; j++) {
      for (let b = 0; b < box.sections[i].assignments[j].length; b++) {
        if (box.sections[i].assignments[j][b] == "") {
          s++;
        }
      }
    }
  }

  return s;
};

export const getFilledSpaceInBox = (box) => {
  let s = 0;
  for (let i = 0; i < box.sections.length; i++) {
    for (let j = 0; j < box.sections[i].assignments.length; j++) {
      for (let b = 0; b < box.sections[i].assignments[j].length; b++) {
        if (box.sections[i].assignments[j][b] != "") {
          s++;
        }
      }
    }
  }

  return s;
};
