/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
export declare const toolbox: {
    kind: string;
    contents: ({
        kind: string;
        name: string;
        colour: string;
        contents: {
            kind: string;
            type: string;
        }[];
        categorystyle?: undefined;
        custom?: undefined;
    } | {
        kind: string;
        name: string;
        categorystyle: string;
        contents: ({
            kind: string;
            type: string;
            inputs: {
                TIMES: {
                    shadow: {
                        type: string;
                        fields: {
                            NUM: number;
                        };
                    };
                };
                FROM?: undefined;
                TO?: undefined;
                BY?: undefined;
            };
        } | {
            kind: string;
            type: string;
            inputs?: undefined;
        } | {
            kind: string;
            type: string;
            inputs: {
                FROM: {
                    shadow: {
                        type: string;
                        fields: {
                            NUM: number;
                        };
                    };
                };
                TO: {
                    shadow: {
                        type: string;
                        fields: {
                            NUM: number;
                        };
                    };
                };
                BY: {
                    shadow: {
                        type: string;
                        fields: {
                            NUM: number;
                        };
                    };
                };
                TIMES?: undefined;
            };
        })[];
        colour?: undefined;
        custom?: undefined;
    } | {
        kind: string;
        name: string;
        categorystyle: string;
        contents: ({
            kind: string;
            type: string;
            fields: {
                NUM: number;
            };
            inputs?: undefined;
        } | {
            kind: string;
            type: string;
            inputs: {
                A: {
                    shadow: {
                        type: string;
                        fields: {
                            NUM: number;
                        };
                    };
                };
                B: {
                    shadow: {
                        type: string;
                        fields: {
                            NUM: number;
                        };
                    };
                };
                NUMBER_TO_CHECK?: undefined;
                DIVIDEND?: undefined;
                DIVISOR?: undefined;
            };
            fields?: undefined;
        } | {
            kind: string;
            type: string;
            inputs: {
                NUMBER_TO_CHECK: {
                    shadow: {
                        type: string;
                        fields: {
                            NUM: number;
                        };
                    };
                };
                A?: undefined;
                B?: undefined;
                DIVIDEND?: undefined;
                DIVISOR?: undefined;
            };
            fields?: undefined;
        } | {
            kind: string;
            type: string;
            inputs: {
                DIVIDEND: {
                    shadow: {
                        type: string;
                        fields: {
                            NUM: number;
                        };
                    };
                };
                DIVISOR: {
                    shadow: {
                        type: string;
                        fields: {
                            NUM: number;
                        };
                    };
                };
                A?: undefined;
                B?: undefined;
                NUMBER_TO_CHECK?: undefined;
            };
            fields?: undefined;
        })[];
        colour?: undefined;
        custom?: undefined;
    } | {
        kind: string;
        name: string;
        categorystyle: string;
        contents: ({
            kind: string;
            type: string;
            inputs?: undefined;
        } | {
            kind: string;
            type: string;
            inputs: {
                TEXT: {
                    shadow: {
                        type: string;
                        fields: {
                            TEXT: string;
                        };
                    };
                };
                SUB?: undefined;
            };
        } | {
            kind: string;
            type: string;
            inputs: {
                SUB: {
                    shadow: {
                        type: string;
                    };
                };
                TEXT: {
                    shadow: {
                        type: string;
                        fields?: undefined;
                    };
                };
            };
        })[];
        colour?: undefined;
        custom?: undefined;
    } | {
        kind: string;
        name?: undefined;
        colour?: undefined;
        contents?: undefined;
        categorystyle?: undefined;
        custom?: undefined;
    } | {
        kind: string;
        name: string;
        categorystyle: string;
        custom: string;
        colour?: undefined;
        contents?: undefined;
    })[];
};
//# sourceMappingURL=toolbox.d.ts.map