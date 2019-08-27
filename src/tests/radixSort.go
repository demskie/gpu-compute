package main

import (
	"fmt"
	"math"
	"sync"
)

func main() {
	// https://developer.nvidia.com/gpugems/GPUGems3/gpugems3_ch39.html
	// http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.177.8755&rep=rep1&type=pdf

	alpha := [16]int{
		25, 157, 31, 67,
		104, 106, 173, 240,
		44, 226, 170, 82,
		160, 56, 83, 165,
	}
	fmt.Println(alpha)

	for i := 7; i >= 0; i-- {
		// mask
		masked := [16]int{}
		NewWorkerPool(16).Execute(func(id int) {
			if getBit(i, byte(alpha[id])) == 0 {
				masked[id] = 1
			} else {
				masked[id] = 0
			}
		})
		fmt.Println(masked)

		// scan
		scanned := masked
		tmpScanned := [16]int{}
		for i := 0.0; int(math.Pow(2, i)) < len(alpha); i++ {
			p := int(math.Pow(2, i))
			NewWorkerPool(16).Execute(func(id int) {
				if id-p >= 0 {
					tmpScanned[id] = scanned[id-p] + scanned[id]
				} else {
					tmpScanned[id] = scanned[id]
				}

			})
			for i := range tmpScanned {
				scanned[i] = tmpScanned[i]
			}
		}
		fmt.Println("scan:", scanned)

		// scatter
		scatter := [16]int{}
		path := [16]int{}
		NewWorkerPool(16).Execute(func(id int) {
			if getBit(i, byte(alpha[id])) == 0 {
				if id == 0 {
					scatter[id] = 0
					path[id] = 1
				} else {
					scatter[id] = scanned[id-1]
					path[id] = 2
				}
			} else {
				if id == 0 {
					scatter[id] = id + scanned[len(scanned)-1]
					path[id] = 3
				} else {
					scatter[id] = id - scanned[id-1] + scanned[len(scanned)-1]
					path[id] = 4
				}
			}
		})
		fmt.Println("scatter:", scatter)

		// transpose
		transpose := [16]int{}
		NewWorkerPool(16).Execute(func(id int) {
			for j, pos := range scatter {
				if pos == id {
					transpose[id] = alpha[j]
				}
			}
		})
		fmt.Printf("%v\n\n", transpose)

	}
}

func getBit(i int, b byte) int {
	var bits [8]int
	bits[0] = b2i(b >= 128)
	if bits[0] == 1 {
		b -= 128
	}
	bits[1] = b2i(b >= 64)
	if bits[1] == 1 {
		b -= 64
	}
	bits[2] = b2i(b >= 32)
	if bits[2] == 1 {
		b -= 32
	}
	bits[3] = b2i(b >= 16)
	if bits[3] == 1 {
		b -= 16
	}
	bits[4] = b2i(b >= 8)
	if bits[4] == 1 {
		b -= 8
	}
	bits[5] = b2i(b >= 4)
	if bits[5] == 1 {
		b -= 4
	}
	bits[6] = b2i(b >= 2)
	if bits[6] == 1 {
		b -= 2
	}
	bits[7] = b2i(b == 1)
	return bits[i]
}

func b2i(b bool) int {
	if b {
		return 1
	}
	return 0
}

type someWork struct {
	threadID int
	callback func(int)
}

// WorkerPool allows parallel execution of an arbitrary func()
type WorkerPool struct {
	work chan *someWork
	wg   *sync.WaitGroup
}

// NewWorkerPool returns a WorkerPool object that facilitates
// parallel processing by calling the Execute() func
func NewWorkerPool(count int) (pool *WorkerPool) {
	if count < 1 {
		return nil
	}
	pool = &WorkerPool{
		work: make(chan *someWork, count),
		wg:   &sync.WaitGroup{},
	}
	for i := 0; i < count; i++ {
		go func() {
			for w := range pool.work {
				w.callback(w.threadID)
				pool.wg.Done()
			}
		}()
	}
	return pool
}

// Execute will pass the func() argument to each goroutine whilst
// signaling them to start executing and then block until completion
func (pool *WorkerPool) Execute(callback func(thread int)) {
	pool.wg.Add(cap(pool.work))
	for i := 0; i < cap(pool.work); i++ {
		pool.work <- &someWork{i, callback}
	}
	pool.wg.Wait()
}

// Delete cancels the goroutines
func (pool *WorkerPool) Delete() {
	select {
	case <-pool.work:
		return
	default:
		close(pool.work)
	}
}
