const sizes = {
    expanded: 42,
    neighbor: 41,
    passive: 40,
};

const color = {
    passive: 'rgba(200,190,200)',
    expanded: 'rgba(174,200,174)',
    expandedNeighbor: 'rgb(168, 174, 168)',
};



const nodesStylePassive = {
    'text-background-color': '#fafafa',
    'text-background-opacity': '0.9',
    'text-border-style': "solid",
    'content': 'data(id)',
    shape: 'roundrectangle',
    'color': '#818181',
    fontSize: '1em',
    'text-border-width': 1,
    'text-border-color': '#b3b3b3',
    'text-border-opacity': 0,
    'text-wrap': 'wrap',
    'text-max-width': '13em',
    padding: "20%",
    width: sizes.passive,
    height: sizes.passive,
    backgroundColor: color.passive,

    'ghost': 'yes',
};

export const graphStyle = [
    {
        selector: 'node',
        style: nodesStylePassive
    },
    {
        selector: 'edge',
        style: {
            'content': 'data(label)',
            'text-rotation': 'autorotate',
            'text-background-color': '#fafafa',
            'text-background-opacity': '0.9',
            'text-border-color': "#232323",
            'text-border-opacity': "0.5",
            'color': '#fafafa',
            'text-outline-color': '#232323',
            'text-outline-width': '1px',
            'width': 3,
            'curve-style': 'bezier',
            'line-color': '#454545',
        }
    },
    {
        selector: 'edge.sourceArrow',
        style: {
            'source-arrow-color': '#454545',
            'source-arrow-shape': 'triangle'
        }
    },
    {
        selector: 'edge.targetArrow',
        style: {
            'target-arrow-color': '#454545',
            'target-arrow-shape': 'triangle'
        }
    },
    {
        selector: 'edge.is-in-group',
        style: {
            'width': 5,
            'line-style': 'dashed',
            'curve-style': 'bezier',
            'line-color': '#0f0f0f',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
        }
    },

    {
        selector: 'node.highlight',
        style: {
            'background-color': 'rgb(96, 80, 96)',
            'label': 'data(id)'
        }
    },
    {
        selector: 'edge.highlight',
        style: {
            'width': 10,
            'line-color': '#ccb8b8',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
        }
    },
    {
        selector: 'node.flash-shadow',
        style: {
            'width': 50,
            'height': 50
        }
    },
    {
        selector: 'node.group',
        style: {
            'background-opacity': '0.2',
        }
    },
    {
        selector: '$node > node',
        style: {
            'padding-top': '10px',
            'padding-left': '10px',
            'padding-bottom': '10px',
            'padding-right': '10px',
            'text-valign': 'top',
            'text-halign': 'center',
            'background-color': "white"
        }
    },
];

export const layoutOptions = {
    cola: {
        nodeDimensionsIncludeLabels: true,
    }
};

export const nodeColorClasses = () => colorOptions.map(color => ({
        selector: `node.${color}`,
        style: {
            'background-color': color,
        }
    })
);

export const nodeShapeClasses =  () => nodeShapes.map(shape => ({
        selector: `node.${shape}`,
        style: {
            'shape': shape,
        }
    })
);


export const nodeShapes = [
    "ellipse",
    "triangle",
    "rectangle",
    "roundrectangle",
    "bottomroundrectangle",
    "cutrectangle",
    "barrel",
    "rhomboid",
    "diamond",
    "pentagon",
    "hexagon",
    "concavehexagon",
    "heptagon",
    "octagon",
    "star",
    "tag",
    "vee"];

export const colorOptions = [
    "aliceblue",
    "antiquewhite",
    "aqua",
    "aquamarine",
    "azure",
    "beige",
    "bisque",
    "black",
    "blanchedalmond",
    "blue",
    "blueviolet",
    "brown",
    "burlywood",
    "cadetblue",
    "chartreuse",
    "chocolate",
    "coral",
    "cornflowerblue",
    "cornsilk",
    "crimson",
    "cyan",
    "darkblue",
    "darkcyan",
    "darkgoldenrod",
    "darkgray",
    "darkgreen",
    "darkgrey",
    "darkkhaki",
    "darkmagenta",
    "darkolivegreen",
    "darkorange",
    "darkorchid",
    "darkred",
    "darksalmon",
    "darkseagreen",
    "darkslateblue",
    "darkslategray",
    "darkslategrey",
    "darkturquoise",
    "darkviolet",
    "deeppink",
    "deepskyblue",
    "dimgray",
    "dimgrey",
    "dodgerblue",
    "firebrick",
    "floralwhite",
    "forestgreen",
    "fuchsia",
    "gainsboro",
    "ghostwhite",
    "gold",
    "goldenrod",
    "gray",
    "green",
    "greenyellow",
    "grey",
    "honeydew",
    "hotpink",
    "indianred",
    "indigo",
    "ivory",
    "khaki",
    "lavender",
    "lavenderblush",
    "lawngreen",
    "lemonchiffon",
    "lightblue",
    "lightcoral",
    "lightcyan",
    "lightgoldenrodyellow",
    "lightgray",
    "lightgreen",
    "lightgrey",
    "lightpink",
    "lightsalmon",
    "lightseagreen",
    "lightskyblue",
    "lightslategray",
    "lightslategrey",
    "lightsteelblue",
    "lightyellow",
    "lime",
    "limegreen",
    "linen",
    "magenta",
    "maroon",
    "mediumaquamarine",
    "mediumblue",
    "mediumorchid",
    "mediumpurple",
    "mediumseagreen",
    "mediumslateblue",
    "mediumspringgreen",
    "mediumturquoise",
    "mediumvioletred",
    "midnightblue",
    "mintcream",
    "mistyrose",
    "moccasin",
    "navajowhite",
    "navy",
    "oldlace",
    "olive",
    "olivedrab",
    "orange",
    "orangered",
    "orchid",
    "palegoldenrod",
    "palegreen",
    "paleturquoise",
    "palevioletred",
    "papayawhip",
    "peachpuff",
    "peru",
    "pink",
    "plum",
    "powderblue",
    "purple",
    "red",
    "rosybrown",
    "royalblue",
    "saddlebrown",
    "salmon",
    "sandybrown",
    "seagreen",
    "seashell",
    "sienna",
    "silver",
    "skyblue",
    "slateblue",
    "slategray",
    "slategrey",
    "snow",
    "springgreen",
    "steelblue",
    "tan",
    "teal",
    "thistle",
    "tomato",
    "turquoise",
    "violet",
    "wheat",
    "white",
    "whitesmoke",
    "yellow",
    "yellowgreen"
]

export default [...graphStyle, ...nodeColorClasses(), ...nodeShapeClasses()]
