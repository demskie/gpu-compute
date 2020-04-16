#ifndef BIG_INT_GREATER_THAN_00
#define BIG_INT_GREATER_THAN_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef BIG_INT_REMOVE_TWOS_COMPLEMENT_00
bool bigintRemoveTwosComplement(in float [BYTE_COUNT]);
#endif

bool bigintGreaterThan(in float a[BYTE_COUNT], in float b[BYTE_COUNT]) {
    float cmp;
    bool aNegative = bigintRemoveTwosComplement(a);
    bool bNegative = bigintRemoveTwosComplement(b);
    cmp += float(aNegative == false && bNegative == true);
    cmp -= float(aNegative == true && bNegative == false);
    for (int i = BYTE_COUNT - 1; i >= 0; i--) {
        cmp += float(cmp == 0.0) * float(a[i] > b[i]);
        cmp -= float(cmp == 0.0) * float(a[i] < b[i]);
    }
    return cmp > 0.0;
}

#endif