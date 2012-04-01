var lib_buffersArray={
    concat:function(p, n, tc) {
        var res=[];
        for (var i=0; i<p.length/3; i++) {
           res.push(p[i*3], p[i*3+1], p[i*3+2], n[i*3], n[i*3+1], n[i*3+2], tc[i*2], tc[i*2+1]);
        }
        return res;
    },

    //same than previous but with option array
    concato:function(p, n, tc, o) {
        var res=[];
        for (var i=0; i<p.length/3; i++) {
           res.push(p[i*3], p[i*3+1], p[i*3+2], n[i*3], n[i*3+1], n[i*3+2], tc[i*2], tc[i*2+1], o[i*2], o[i*2+1]);
        }
        return res;
    },
    
    sort: function (buffPos, buffIndex, less, shift) {
        shift = shift || 8;
        lib_buffersArray.quickSort(buffPos, buffIndex, less, 0, Math.floor(buffPos.length / shift) - 1, shift);
    },
    
    // buffPos : the vertexBuffer (3 element for pos, shift elements per vertex
    quickSort: function (buffPos, buffIndex, less, first, last, shift)
    {
        shift = shift || 8;
        if (first < last) {
            var pivot = first; //lib_maths.randomInt(first, last); 
            pivot = lib_buffersArray.part(buffPos, buffIndex, less, first, last, pivot, shift);
            lib_buffersArray.quickSort(buffPos, buffIndex, less, first, pivot-1, shift);
            lib_buffersArray.quickSort(buffPos, buffIndex, less, pivot+1, last, shift);
        }
    },
    
    // partitionne le tableau
    part: function (buffPos, buffIndex, less, first, last, pivot, shift) {
        shift = shift || 8;
        lib_buffersArray.swap(buffPos, buffIndex, pivot, last, shift);
        var j = first;
        for (var i = first; i < last; ++i) {
            var is = shift*i;
            var ls = last*shift;
            if (less(buffPos[is], buffPos[is+1], buffPos[is+2], buffPos[ls], buffPos[ls+1], buffPos[ls+2])) {
                lib_buffersArray.swap(buffPos, buffIndex, i, j, shift);
                ++j;
            }
        }
        lib_buffersArray.swap(buffPos, buffIndex, last, j, shift);
        return j;
    },
    
    // swap index i and j in buffIndex and buffPos
    swap: function (buffPos, buffIndex, i, j, shift)
    {
        var tmpPos, tmpIndex;
        tmpIndex = buffIndex[i];
        buffIndex[i] = buffIndex[j];
        buffIndex[j] = tmpIndex;
        
        var idx = shift*i;
        var jdx = shift*j;
        for (var k = 0 ; k < shift; ++k, ++idx, ++jdx) {
            tmpPos = buffPos[idx];
            buffPos[idx] = buffPos[jdx];
            buffPos[jdx] = tmpPos;
        }
    },
    
    // lexicographic order on triplets
    less: function (a, b, c, a1, b1, c1) {
        return ((a < a1) || (a === a1 && b < b1) || (a === a1 && b === b1 && c < c1));
    },
    
    equal: function (a, b, c, d, e, f, tol) {
        if (Math.abs(a-d) > tol)
            return false;
        if (Math.abs(b-e) > tol)
            return false;
        if (Math.abs(c-f) > tol)
            return false;
        return true;
    },
    
    tol: 1e-5,
    
    removeDoubles: function (buffPos, buffIndex, less, shift) {
        lib_buffersArray.sort(buffPos, buffIndex, less, shift);
        var newFaces = [];
        var newPos = [];
        // loop on vertex
        var numVertex = buffIndex.length;
        var i = 0;
        var count = 0;
        for ( ; i < numVertex - 1; ++i) {
            var idx = shift*i;
            var jdx = idx+shift;
            newFaces[buffIndex[i]] = count;
            if (!lib_buffersArray.equal(buffPos[idx], buffPos[idx+1], buffPos[idx+2], buffPos[jdx], buffPos[jdx+1], buffPos[jdx+2], lib_buffersArray.tol)) {
                newPos.push(buffPos[idx], buffPos[idx+1], buffPos[idx+2], buffPos[idx+3], buffPos[idx+4], buffPos[idx+5], buffPos[idx+6], buffPos[idx+7]);
                count++;
            }
        }
        newPos.push(buffPos[idx], buffPos[idx+1], buffPos[idx+2], buffPos[idx+3], buffPos[idx+4], buffPos[idx+5], buffPos[idx+6], buffPos[idx+7]);        
        newFaces[buffIndex[i]] = count;
        
        
        for (i = 0 ; i < newFaces.length; ++i) {
            buffIndex[i] = newFaces[i];
            buffPos[i] = newPos[i];
        }
        buffIndex.splice(i, buffIndex.length);
        for ( ; i < newPos.length; ++i) {
            buffPos[i] = newPos[i];
        }
        buffPos.splice(i, buffPos.length);
    }
};

